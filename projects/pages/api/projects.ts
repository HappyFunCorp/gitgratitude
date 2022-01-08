import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id) {
    res.status(404).json({ message: "No project id" });
  }

  const project = await prisma.project.findFirst({ where: { id: `${id}` } });
  res.status(200).json(project);
}
