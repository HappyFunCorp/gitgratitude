import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lockfile_id } = req.query;
  if (!lockfile_id) {
    res.status(404).json({ message: "No lockfile_id" });
  }

  const releases = await prisma.dependency.findMany({
    where: { lockfile_id: `${lockfile_id}` },
    include: { project: true, release: true },
  });
  res.status(200).json(releases);
}
