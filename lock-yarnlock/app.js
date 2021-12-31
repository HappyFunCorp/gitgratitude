const bodyParser = require("body-parser");
const express = require("express");
const { parseYarnLock } = require("./parseYarnLock");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "*/*", limit: "5000kb" }));

app.get("/", (req, res) => {
  console.log("Got get on root");
  res.send("Part of <a href='https://gitgratitude.com'>gitgratitude.com</a>!");
});

app.post("/", (req, res) => {
  console.log("Attempting to parse...");

  // console.log(req.body.toString());
  // const body = JSON.parse(req.body.toString());

  const body = req.body.toString();

  const lockfile = parseYarnLock(req.body.toString());

  console.log("...parsed");

  res.status(200).json(lockfile);
});

app.post("/test", (req, res) => {
  res.status(200).json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
