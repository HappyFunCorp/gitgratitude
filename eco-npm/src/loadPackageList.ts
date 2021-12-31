import axios from 'axios';
import { readFileSync, writeFileSync } from 'fs';

const url = 'https://lock-packagelock.default.gitgratitude.com';
console.log(`Passing package-lock.json to ${url}`);

(async () => {
  const data = await readFileSync('./package-lock.json').toString();

  console.log(`Calling ${url}`);
  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Writing ./package-list.json');

  writeFileSync('./package-list.json', JSON.stringify(response.data));
})().then((e) => console.log('Done'));
