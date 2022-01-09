import { Ecosystem, lookupEcosystem } from "lib/ecosystem";
import { syncProjectFromJson } from "lib/projects";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ecosystem, name } = req.body;

  const eco = lookupEcosystem(ecosystem);

  if (eco) {
    await doPackageRequest(res, eco, name);
  } else {
    res
      .status(200)
      .json({ message: `Unknown or misconfigured ecosystem ${ecosystem}` });
  }
}

async function doPackageRequest(
  res: NextApiResponse,
  ecosystem: Ecosystem,
  name: string
) {
  console.log(`Looking up ${ecosystem.name}/${name}`);
  const url = new URL(ecosystem.package_endpoint);
  url.searchParams.append("package", name);
  const response = await fetch(url.href);
  console.log("Response ok?", response.ok);
  if (response.ok) {
    const json = await response.json();
    let project = await syncProjectFromJson(ecosystem, json);
    project = await prisma.project.findFirst({ where: { id: project.id } });
    res.status(200).json(project);
  } else {
    const json = await response.json();
    console.log(json);
    res.status(response.status).json(json);
  }
}
