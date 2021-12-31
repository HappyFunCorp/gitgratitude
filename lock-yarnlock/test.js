"use strict";

const axios = require("axios");
const { readFileSync } = require("fs");

const data = readFileSync("yarn.lock").toString();

console.log(`data.length = ${data.length}`);

axios
  .post("http://localhost:3000", data, {
    headers: { "Content-Type": "application/octet-stream" },
  })
  .then((response) => {
    console.log(response.status);
    console.log(response.data);
  });
