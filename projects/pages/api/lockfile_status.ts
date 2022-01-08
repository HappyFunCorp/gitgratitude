import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id) {
    res.status(404).json({ message: "No lockfile id" });
    return;
  }

  const dependencies = await prisma.dependency.findMany({
    where: { lockfile_id: `${id}` },
  });

  const status = {
    count: dependencies.length * 2,
    processed: dependencies.length,
  };

  for (const d of dependencies) {
    if (
      d.project_id &&
      d.synced &&
      d.synced.getTime() > new Date().getTime() - 5 * 60 * 1000
    ) {
      status.processed += 1;
    }
  }
  res.status(200).json(status);
}
