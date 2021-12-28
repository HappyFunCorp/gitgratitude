import axios from "axios";
import { lookupParser } from "lib/ecosystem";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { syncLockfileFromJson } from "lib/lockfiles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (!id) {
    res.status(404).json({ message: "No lockfile id" });
  }
  const lockfile = await prisma.lockfile.findFirst({
    where: { id: `${id}` },
  });

  console.log(`Working on ${id}`);

  if (!lockfile) {
    res.status(404).json({ id, message: "Lockfile not found" });
    return;
  }

  const parser = lookupParser(lockfile.name);

  if (!parser) {
    res
      .status(404)
      .json({ id, message: `Parser for ${lockfile.name} not found` });
    return;
  }

  const data = lockfile.data;

  console.log(`Calling ${parser.parser_endpoint} for ${lockfile.name}`);

  const response = await fetch(parser.parser_endpoint, {
    method: "post",
    body: data,
  });

  if (!response.ok) {
    res
      .status(response.status)
      .json({ id, message: "Error from parsing service" });
    return;
  }

  const lockfileJson = await response.json();

  await syncLockfileFromJson(lockfile, lockfileJson);

  res.status(200).json({ id: id, message: "Parsing" });
}
