/*
import axios from 'axios';
import { readFileSync } from 'fs';
import { URL } from 'url';

const startTime = timingMark('Started');

(async () => {
  const file = 'package-list.json';
  const lockfile = JSON.parse(readFileSync(file).toString());

  for (const d of lockfile.dependencies) {
    console.log(d.name);

    const url = new URL('https://eco-npm.default.gitgratitude.com');
    url.searchParams.append('package', d.name);
    console.log(`Calling ${url.href}`);
    const response = await axios.get(url.href);
    console.log(`Response ${response.statusText}`);
  }
})().then(() => {
  timingMark('Finished', startTime);
  console.log('Done');
});

function timingMark(msg: string, startTime?: number) {
  const t = new Date().getTime();

  console.log(`${t} ${msg} ${startTime ? t - startTime : ''}`);

  return t;
}
*/
