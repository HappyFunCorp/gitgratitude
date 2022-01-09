import fs from "fs";
import { Lockfile } from "@prisma/client";
import { File } from "next-runtime/runtime/body-parser";
import { lookupEcosystem, lookupParser } from "./ecosystem";
import { prisma } from "lib/prisma";
import { returnOrLookupProject } from "./projects";

export async function tryLockFile(file: File): Promise<Lockfile | null> {
  const parser = lookupParser(file.name);

  if (!parser) {
    console.log(`Didn't find parser for ${file.name}`);
    return null;
  }

  const contents = fs.readFileSync(file.path).toString();

  const lockfileData = {
    name: file.name,
    ecosystem: parser.ecosystem,
    file_type: parser.file_type,
    valid: true,
    parsed: false,
    data: contents,
    uploadedAt: new Date(),
  };

  const lockfile = await prisma.lockfile.create({
    data: lockfileData,
  });

  console.log(`Lockfile ${lockfile.id} stored`);

  return lockfile;
}

export async function syncLockfileFromJson(lockfile: Lockfile, json) {
  await mergeDependencies(lockfile, json);
  await lookupProjects(lockfile);
  await linkReleases(lockfile);

  const data = {
    parsed: true,
    processedAt: new Date(),
  };

  console.log("Updating processed at");
  await prisma.lockfile.update({
    where: { id: lockfile.id },
    data: data,
  });
}

export async function mergeDependencies(lockfile, json) {
  console.log(`Found ${json.dependencies.length} dependencies from json`);
  const ds = await prisma.dependency.findMany({
    where: { lockfile_id: lockfile.id },
  });

  for (const d of json.dependencies) {
    const dependancy = ds.filter((db_d) => d.name == db_d.name);

    if (dependancy.length == 0) {
      console.log(`creating ${d.name}`);
      await prisma.dependency.create({
        data: {
          lockfile_id: lockfile.id,
          name: d.name,
          version: d.version,
        },
      });
    }
  }
}

export async function lookupProjects(lockfile) {
  await linkProjects(lockfile);

  console.log(`Looking up projects...`);
  const ecosystem = lookupEcosystem(lockfile.ecosystem);

  const dependancies = await prisma.dependency.findMany({
    where: { lockfile_id: lockfile.id, project_id: { equals: null } },
  });

  console.log(
    `Found ${dependancies.length} unknown projects in dependency list`
  );

  for (const d of dependancies) {
    const project = await returnOrLookupProject(ecosystem, d.name);

    if (project) {
      console.log(`Found ${project.ecosystem}/${project.name}`);
      const data = {
        project_id: project.id,
        current_version: project.latest_version,
        synced: new Date(),
      };

      await prisma.dependency.update({ where: { id: d.id }, data: data });
    } else {
      console.log(`Couldn't find dependancy for ${ecosystem.name}/${d.name}`);
    }
  }

  await linkProjects(lockfile);
}

export async function linkProjects(lockfile: Lockfile) {
  console.log(`Linking projects...`);
  const results = await prisma.$executeRawUnsafe(`
  update dependencies 
  set project_id = projects.id 
  from projects
  where
  lockfile_id ='${lockfile.id}' and
  projects.name = dependencies.name and
  projects.ecosystem = '${lockfile.ecosystem}'`);
}

export async function linkReleases(lockfile) {
  console.log(`Linking releases...`);
  await prisma.$executeRawUnsafe(`update dependencies set
  release_id = releases.id,
  major = releases.major,
  minor = releases.minor,
  patch = releases.patch, 
  prerelease = releases.prerelease,
  suffix = releases.suffix
  from releases
  where
  lockfile_id ='${lockfile.id}' and
  releases.project_id = dependencies.project_id and
  releases.version = dependencies.version`);
}
