import fs from "fs";
import { Lockfile } from "@prisma/client";
import { File } from "next-runtime/runtime/body-parser";
import { lookupParser } from "./ecosystem";
import { prisma } from "lib/prisma";

export async function tryLockFile(file: File): Promise<Lockfile | null> {
  const parser = lookupParser(file.name);

  if (!parser) {
    console.log(`Didn't find parser for ${file.name}`);
    return null;
  }

  const contents = fs.readFileSync(file.path).toString();

  const lockfileData = {
    name: file.name,
    ecosystem: parser.ecosystem,
    file_type: parser.file_type,
    valid: true,
    parsed: false,
    data: contents,
    uploadedAt: new Date(),
  };

  const lockfile = await prisma.lockfile.create({
    data: lockfileData,
  });

  console.log(`Lockfile ${lockfile.id} stored`);

  return lockfile;
}
