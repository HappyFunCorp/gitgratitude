import fs from "fs";
import { Lockfile } from "@prisma/client";
import { File } from "next-runtime/runtime/body-parser";
import tmp from "tmp";
import { lookupParser } from "./ecosystem";

export async function tryLockFile(
  file: File,
  stream: NodeJS.ReadableStream
): Promise<Lockfile> {
  const tmpobj = tmp.fileSync();

  console.log(`Writing to ${tmpobj.name}`);
  stream.pipe(fs.createWriteStream(tmpobj.name));
  const fileData = fs.readFileSync(tmpobj.name);

  console.log(`Should remove ${tmpobj.name}`);
  // tmpobj.removeCallback();

  const parser = lookupParser(file.name);

  if (!parser) {
    console.log(`Didn't find parser for ${file.name}`);
    return null;
  }

  const lockfileData = {
    name: file.name,
    ecosystem: parser.ecosystem,
    file_type: parser.file_type,
    valid: true,
    parsed: false,
    data: fileData,
    uploadedAt: new Date(),
  };

  const lockfile = await prisma.lockfile.create({
    data: lockfileData,
  });

  return lockfile;
}
