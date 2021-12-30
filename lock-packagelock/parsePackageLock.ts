import { readFileSync } from "fs";

export type Lockfile = {
  dependancies: Dependancy[];
};
export type Dependancy = {
  name: string;
  version: string;
};

export function parsePackageLock(lockfile: any) {
  const dependancies = new Array<Dependancy>();

  for (const d of Object.keys(lockfile.packages)) {
    const name = d.replace("node_modules/", "");
    dependancies.push({ name, version: lockfile.packages[d].version });
  }

  return { dependancies };
}

if (__filename === process.argv[1]) {
  const data = readFileSync("package-lock.json").toString();

  const lockfile = parsePackageLock(JSON.parse(data));
  console.log(lockfile);
}
