import axios from "axios";
import { lookupParser } from "lib/ecosystem";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  const lockfile = await prisma.lockfile.findFirst({
    where: { id },
    select: { id: true, name: true, data: true },
  });

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
  console.log(lockfile);

  const data = lockfile.data;
  console.log("Do we have data?");
  console.log(data);

  console.log(`Calling ${parser.parser_endpoint}`);
  const response = await axios(parser.parser_endpoint, {
    method: "post",
    data: data,
  });

  // console.log(response);

  res.status(200).json({ id: id, message: "Parsing" });
}
