import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, ecosystem } = req.query;
  if (id) {
    const project = await prisma.project.findFirst({ where: { id: `${id}` } });
    res.status(200).json(project);
    return;
  }

  if (ecosystem) {
    if (ecosystem == "all") {
      res.status(200).json(await prisma.project.findMany());
    } else {
      const projects = await prisma.project.findMany({
        // @ts-expect-error
        where: { ecosystem: `${ecosystem}` },
      });
      res.status(200).json(projects);
    }
  }
  res.status(404).json({ message: "No project id" });
}
