import { prisma } from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, count } = req.query;
  if (id) {
    const lockfile = await prisma.lockfile.findFirst({
      select: {
        id: true,
        name: true,
        ecosystem: true,
        valid: true,
        parsed: true,
        uploadedAt: true,
        processedAt: true,
      },
      where: { id: `${id}` },
    });
    res.status(200).json(lockfile);
    return;
  }

  if (count) {
    const lockfiles = await prisma.lockfile.findMany({
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
            Dependency: true,
          },
        },
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: parseInt(`${count}`),
    });

    res.status(200).json(lockfiles);
    return;
  }

  res.status(404).json({ message: "pass in id or count" });
}
