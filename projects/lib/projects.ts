import { prisma } from "lib/prisma";
import { Ecosystem, Project } from ".prisma/client";

export async function syncProjectFromJson(ecoName: string, projectJson) {
  console.log(`Updating ${ecoName}/${projectJson.name}`);

  const ecosystem = await prisma.ecosystem.upsert({
    where: { name: ecoName },
    create: { name: ecoName },
    update: { name: ecoName },
  });

  const existingProject = await prisma.project.findFirst({
    where: { name: projectJson.name, ecosystem: ecosystem },
  });

  const data = {
    ecosystem_name: ecosystem.name,
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
    syncReleases(project, projectJson);
  } else {
    const project = await prisma.project.create({ data: data });
    syncReleases(project, projectJson);
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
    orderBy: { released: "asc" },
  });

  if (first_release) {
    await prisma.project.update({
      where: { id: project.id },
      data: { first_release: first_release.released },
    });
  }

  const latest_release = await prisma.release.findFirst({
    select: { released: true, version: true },
    orderBy: { released: "desc" },
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
  return parseInt(value);
}
