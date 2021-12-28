import { prisma } from "lib/prisma";
import { Project } from ".prisma/client";
import { Ecosystem, lookupEcosystem } from "./ecosystem";

export async function syncProjectFromJson(
  ecoName: Ecosystem,
  projectJson
): Promise<Project | null> {
  console.log(`Updating ${ecoName.name}/${projectJson.name}`);

  const ecosystem = lookupEcosystem(ecoName.name);

  const existingProject = await prisma.project.findFirst({
    where: { name: projectJson.name, ecosystem: ecosystem.enum },
  });

  const data = {
    ecosystem: ecosystem.enum,
    name: projectJson.name,
    homepage: projectJson.homepage,
    description: projectJson.description,
    summary: projectJson.summary,
    git: projectJson.git,
  };

  if (existingProject) {
    const project = await prisma.project.update({
      where: { id: existingProject.id },
      data: data,
    });
    await syncReleases(project, projectJson);
    return existingProject;
  } else {
    const project = await prisma.project.create({ data: data });
    await syncReleases(project, projectJson);
    return project;
  }
}

async function syncReleases(project: Project, projectJson: any) {
  projectJson["releases"].map(async (releaseJson) => {
    const release = await prisma.release.findFirst({
      where: { project_id: project.id, version: releaseJson.version },
    });

    const data = {
      version: releaseJson.version,
      released: releaseJson.created_at,
      summary: releaseJson.summary,
      description: releaseJson.description,
      license: JSON.stringify(releaseJson.licenses),
      download_count: releaseJson.download_count,
      major: integerOrNil(releaseJson.major),
      minor: integerOrNil(releaseJson.minor),
      patch: integerOrNil(releaseJson.patch),
      suffix: releaseJson.suffix,
      prerelease: releaseJson.prerelease,
    };

    if (release) {
      await prisma.release.update({
        where: { id: release.id },
        data: data,
      });
    } else {
      const projectData = {
        project_id: project.id,
        ...data,
      };
      await prisma.release.create({ data: projectData });
    }
  });

  const first_release = await prisma.release.findFirst({
    select: { released: true },
    where: { project },
    orderBy: { released: "desc" },
  });

  if (first_release) {
    await prisma.project.update({
      where: { id: project.id },
      data: { first_release: first_release.released },
    });
  }

  const latest_release = await prisma.release.findFirst({
    select: { released: true, version: true },
    orderBy: { released: "asc" },
  });

  if (latest_release) {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        latest_release: latest_release.released,
        latest_version: latest_release.version,
      },
    });
  }
  return project;
}
function integerOrNil(value: string) {
  const ret = parseInt(value);

  if (!ret || ret === NaN) {
    return null;
  }

  return ret;
}

export async function returnOrLookupProject(
  ecosystem: Ecosystem,
  name: string
) {
  const project = await prisma.project.findFirst({
    where: { ecosystem: ecosystem.enum, name },
  });

  if (project) {
    return project;
  }

  console.log(`Looking up ${ecosystem.name}/${name}`);
  const url = new URL(ecosystem.package_endpoint);
  url.searchParams.append("package", name);
  const response = await fetch(url.href);
  if (response.ok) {
    const json = await response.json();
    const project = await syncProjectFromJson(ecosystem, json);
    return project;
  }

  return null;
}
