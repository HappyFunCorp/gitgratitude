"use strict";

const lockfile = require("@yarnpkg/lockfile");
const { readFileSync } = require("fs");

function parseYarnLock(data) {
  console.log(`Data size is ${data.length}`);
  const result = {
    dependencies: [],
  };

  const deps = lockfile.parse(data).object;

  Object.keys(deps).forEach((elem, index) => {
    result.dependencies.push({ name: elem, version: deps[elem].version });
  });

  return result;
}

module.exports.parseYarnLock = parseYarnLock;

if (__filename === process.argv[1]) {
  console.log(`Hi there`);

  const data = readFileSync(`./yarn.lock`).toString();

  const deps = parseYarnLock(data);

  console.log(deps);
}
