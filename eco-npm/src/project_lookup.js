const axios = require('axios');
const semverParse = require('semver/functions/parse');

/*
export type Project = {
  name: string;
  homepage?: string;
  description?: string;
  git?: string;
  keywords?: string[];
  participants?: Participant[];
  licenses?: string[];
  releases: Release[];
};

export type Release = {
  version: string;
  released?: string;
  summary?: string;
  description?: string;
  licenses?: string[];
  download_count?: number;
  major?: number;
  minor?: number;
  patch?: number;
  suffix?: string;
  prerelease?: boolean;
};

export type Participant = {
  username?: string;
  name?: string;
  email: string;
  type: string;
};

*/

async function projectLookup(name) {
  const res = await axios.get(`https://registry.npmjs.org/${name}`);

  if (res.status !== 200) {
    return { status: res.status };
  }

  const json = res.data;

  const participants = new Array();

  if (json.author) {
    participants.push({
      name: json.author.name,
      email: json.author.email,
      type: 'author',
    });
  }

  if (json.maintainers) {
    addParticipants('maintainers', participants, json.maintainers);
  }

  if (json.contributors) {
    addParticipants('contributors', participants, json.contributors);
  }

  const releases = new Array();

  if (json.time) {
    Object.keys(json.time).forEach((time) => {
      if (json.versions[time]) {
        const v = semverParse(time);

        const r = json.versions[time];
        const release = {
          version: time,
          released: json.time[time],
          major: v.major,
          minor: v.minor,
          patch: v.patch,
          prerelease: v.prerelease.length != 0,
          suffix: v.prerelease.join('.'),
          description: cleanString(r.description),
        };

        releases.push(release);
      }
    });
  }

  const git = normalizeGit(json.repository);
  const ret = {
    name: name,
    homepage: json.homepage,
    description: cleanString(json.description),
    git: git,
    keywords: json.keywords,
    participants,
    licenses: [json.license],
    releases,
  };
  return ret;
}

function normalizeGit(repository) {
  let git = null;

  if (repository) {
    git = repository.url;
  }

  if (git) {
    git = git.replace(/^git\+/, '');
    git = git.replace(/\.git$/, '');
  }

  return git;
}

function cleanString(string) {
  if (!string) {
    return null;
  }
  return string.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
}

function addParticipants(type, participants, collection) {
  if (collection) {
    collection.forEach((person) => {
      participants.push({
        username: person.name,
        email: person.email,
        type,
      });
    });
  }
}

/*
 export type Release = {
  version: string;
  released?: string;
  summary?: string;
  description?: string;
  licenses?: string[];
  download_count?: number;
  major?: number;
  minor?: number;
  patch?: number;
  suffix?: string;
  prerelease?: boolean;
};
*/

module.exports.projectLookup = projectLookup;
