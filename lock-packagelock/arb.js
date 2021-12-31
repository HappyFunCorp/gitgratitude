const Arborist = require("@npmcli/arborist");
const tmp = require("tmp");
const { readFileSync, writeFileSync } = require("fs");

async function parsePackageLock(data) {
  const tmpobj = tmp.dirSync();
  const outfile = `${tmpobj.name}/package-lock.json`;

  console.log(`Writing to ${outfile}`);
  writeFileSync(outfile, data);

  const arb = new Arborist({
    path: tmpobj.name,
  });

  // @ts-expect-error
  return arb.loadVirtual().then((tree) => {
    // console.log("Got virtual tree");
    // console.log(tree);

    // TODO clean up the temp dir
    // tmpobj.removeCallback();

    const dependencies = new Array();

    // for (const edge of tree.edgesOut) {
    //   console.log(edge[0], edge[1].name, edge[1].spec);
    // }

    for (const child of tree.children) {
      // console.log(child[0], child[1].name, child[1].version, child[1].dev);
      dependencies.push({ name: child[1].name, version: child[1].version });
    }

    return new Promise((resolve, reject) => {
      resolve({ dependencies });
    });
  });
}

module.exports.parsePackageLock = parsePackageLock;

if (__filename === process.argv[1]) {
  console.log(`Hi there`);

  const data = readFileSync(`../eco-npm/package-lock.json`).toString();

  parsePackageLock(data).then((r) => console.log(r));
}
