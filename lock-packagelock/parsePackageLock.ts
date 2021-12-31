import { readFileSync } from "fs";

// TODO Remove unused file

export type Lockfile = {
  dependencies: Dependency[];
};
export type Dependency = {
  name: string;
  version: string;
};

export function parsePackageLock(lockfile: any) {
  const dependencies = new Array<Dependency>();

  for (const d of Object.keys(lockfile.packages)) {
    const name = d.replace("node_modules/", "");
    dependencies.push({ name, version: lockfile.packages[d].version });
  }

  return { dependencies };
}

if (__filename === process.argv[1]) {
  const data = readFileSync("package-lock.json").toString();

  const lockfile = parsePackageLock(JSON.parse(data));
  console.log(lockfile);
}
