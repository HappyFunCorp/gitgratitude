import axios from 'axios';

export type Project = {
  name: string;
  homepage?: string;
  description?: string;
  git?: string;
  keywords?: string[];
  participants?: Participant[];
  licenses?: string[];
  releases: Release[]
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

export async function projectLookup(name: string) {
  const res = await axios.get(`https://registry.npmjs.org/${name}`);

  if (res.status==200) {
    const json = res.data;

    const participants = new Array<Participant>();

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

    const releases = new Array<Release>()

    if( json.time ) {
        Object.keys(json.time).forEach( time => {
            if( json.versions[time] ) {
                const r = json.versions[time]
                const release:Release = {
                    version: time,
                    released: json.time[time],
                    description: r.description,
                }

                releases.push( release )
            }
        } )
    }


    const ret: Project = {
      name: name,
      homepage: json.homepage,
      description: json.description,
      git: json.repository.url,
      keywords: json.keywords,
      participants,
      licenses: [ json.license ],
      releases
    };
    return ret;
  }
}

function addParticipants(
  type: string,
  participants: Participant[],
  collection: any,
) {
  if (collection) {
    // @ts-expect-error
    collection.forEach((person) => {
      participants.push({
        username: person.name,
        email: person.email,
        type,
      });
    });
  }
}

// projectLookup('express').then((hi) => console.log(hi));
