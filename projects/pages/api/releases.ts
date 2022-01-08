import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { project_id } = req.query;
  if (!project_id) {
    res.status(404).json({ message: "No project_id" });
  }

  const releases = await prisma.release.findMany({
    where: { project_id: `${project_id}` },
    orderBy: { released: "desc" },
  });
  res.status(200).json(releases);
}
