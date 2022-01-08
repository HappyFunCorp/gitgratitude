const express = require('express');
const { projectLookup } = require('./project_lookup');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const project = req.query.package;
  if (project) {
    console.log(`npm/${project} looking up`);
    res.json(await projectLookup(project));
  } else {
    res.json({ error: true, message: 'Please pass in a package name' });
  }
});

app.get('/restart', (req, res) => {
  res.send('Goodbye');
  process.exit(0);
});

app.listen(port, () => {
  console.log(`eco-npm listening at http://localhost:${port}`);
});
