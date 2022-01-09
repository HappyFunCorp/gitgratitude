const { projectLookup } = require('./project_lookup');
const semverParse = require('semver/functions/parse');

projectLookup('next').then((project) => {
  console.log(project);

  // for (const r of project.releases) {
  //   const v = semverParse(r.version);
  //   console.log(v);
  // }
});
