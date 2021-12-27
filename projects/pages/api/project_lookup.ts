import { syncProjectFromJson } from "lib/projects";

export default async function handler(req, res) {
  const { ecosystem, name } = req.body;
  console.log(`Looking up ${ecosystem}/${name}`);

  if (ecosystem == "rubygems" && process.env.ECO_RUBYGEMS_URL) {
    doRequest(res, ecosystem, name, process.env.ECO_RUBYGEMS_URL);
  } else if (ecosystem == "npm" && process.env.ECO_NPM_URL) {
    doRequest(res, ecosystem, name, process.env.ECO_NPM_URL);
  } else {
    res
      .status(200)
      .json({ message: `Unknown or misconfigured ecosystem ${ecosystem}` });
  }
}

async function doRequest(res, ecosystem, name, endpoint) {
  const url = new URL(endpoint);
  url.searchParams.append("package", name);
  const response = await fetch(url.href);
  if (response.ok) {
    const json = await response.json();
    syncProjectFromJson(ecosystem, json);
    res.status(200).json(json);
  } else {
    const json = await response.json();
    console.log(json);
    res.status(response.status).json(json);
  }
}
