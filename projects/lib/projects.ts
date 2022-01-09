import { prisma } from "lib/prisma";
import { Ecosystem, lookupEcosystem } from "./ecosystem";
import { Project } from "@prisma/client";

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
    last_synced: new Date(),
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
  for (const releaseJson of projectJson["releases"]) {
    const release = await prisma.release.findFirst({
      where: { project_id: project.id, version: releaseJson.version },
    });

    const data = {
      version: releaseJson.version,
      released: releaseJson.released,
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
  }

  const first_release = await prisma.release.findFirst({
    select: { released: true },
    where: { project_id: project.id, prerelease: false },
    orderBy: { released: "asc" },
  });

  if (first_release) {
    const proj = await prisma.project.update({
      where: { id: project.id },
      data: { first_release: first_release.released },
    });
  }

  const latest_release = await prisma.release.findFirst({
    where: { project_id: project.id, prerelease: false },
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

  return await prisma.project.findFirst({ where: { id: project.id } });
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

  if (project && !stale(project)) {
    return project;
  }

  console.log(`Looking up ${ecosystem.name}/${name}`);
  const url = new URL(ecosystem.package_endpoint);
  url.searchParams.append("package", name);
  const response = await fetch(url.href);
  console.log("Response", response.ok);
  if (response.ok) {
    const json = await response.json();
    const project = await syncProjectFromJson(ecosystem, json);
    return project;
  }

  return null;
}

export function stale(project: Project): boolean {
  if (!project.last_synced) {
    return true;
  }

  const prevTime = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
  console.log("last_synced", project.last_synced.getTime());
  console.log("1 day ago  ", prevTime);

  return project.last_synced.getTime() < prevTime;
}

export async function staleProjects() {
  const prevTime = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);

  return await prisma.project.findMany({
    where: {
      OR: [{ last_synced: null }, { last_synced: { lt: prevTime } }],
    },
    orderBy: { last_synced: "desc" },
  });
}
