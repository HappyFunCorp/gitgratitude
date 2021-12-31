import fs from "fs";
import { EcosystemName, Lockfile } from "@prisma/client";
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
  console.log(json);

  console.log("Creating dependancies from json");
  console.log(`Found ${json.dependencies.length}`);
  for (const d of json.dependencies) {
    const dependancy = await prisma.dependancy.findFirst({
      where: { lockfile, name: d.name },
    });

    if (dependancy) {
      console.log(`Updating ${d.name} version`);
      await prisma.dependancy.update({
        where: { id: dependancy.id },
        data: { version: d.version },
      });
    } else {
      console.log(`creating ${d.name}`);
      await prisma.dependancy.create({
        data: {
          lockfile_id: lockfile.id,
          name: d.name,
          version: d.version,
        },
      });
    }
  }

  const ecosystem = lookupEcosystem(lockfile.ecosystem);

  const dependancies = await prisma.dependancy.findMany({
    where: { lockfile_id: lockfile.id },
  });

  console.log(`Found ${dependancies.length} in the database`);

  for (const d of dependancies) {
    const project = await returnOrLookupProject(ecosystem, d.name);

    if (project) {
      console.log(`Found ${project.ecosystem}/${project.name}`);
      const data = {
        project_id: project.id,
        current_version: project.latest_version,
      };

      await prisma.dependancy.update({ where: { id: d.id }, data: data });
    } else {
      console.log(`Couldn't find dependancy for ${ecosystem.name}/${d.name}`);
    }
  }

  const data = {
    parsed: true,
    processedAt: new Date(),
  };

  await prisma.lockfile.update({
    where: { id: lockfile.id },
    data: data,
  });

  console.log("Done parsing");
}

export type LockfileListDTO = {
  uploadedAt: string;
  id: string;
  ecosystem: EcosystemName;
  name: string;
  valid: boolean;
  parsed: boolean;
  processedAt: string;
  dependacies: number;
};

export async function lockfileListWithCounts(): Promise<LockfileListDTO[]> {
  const lockfiles = await prisma.lockfile.findMany({
    orderBy: {
      uploadedAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      name: true,
      ecosystem: true,
      valid: true,
      parsed: true,
      uploadedAt: true,
      processedAt: true,
      _count: {
        select: {
          Dependancy: true,
        },
      },
    },
  });

  const ret = new Array<LockfileListDTO>();

  lockfiles.map((e) => {
    ret.push({
      id: e.id,
      name: e.name,
      ecosystem: e.ecosystem,
      valid: e.valid,
      parsed: e.parsed,
      uploadedAt: convertDate(e.uploadedAt),
      processedAt: convertDate(e.processedAt),
      dependacies: e._count.Dependancy,
    });
  });

  return ret;
}

export function convertDates(lockfile: Lockfile) {
  // @ts-expect-error
  lockfile.uploadedAt = convertDate(lockfile.uploadedAt);

  // @ts-expect-error
  lockfile.processedAt = convertDate(lockfile.processedAt);
}

export function convertDate(d: Date): string | null {
  if (d) {
    return `${d.getFullYear()}/${d.getMonth()}/${d.getDay()} ${d.getHours()}:${d.getMinutes()}`;
  }

  return null;
}
