import Layout from "components/layout";
import ProjectList from "components/project_list";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StaleProjects() {
  const [projects, setProjects] = useState();

  useEffect(() => {
    fetch(`${window.location.origin}/api/stale_projects`)
      .then((res) => res.json())
      .then((projects) => setProjects(projects));
  });

  return (
    <Layout title="Stale Projects">
      <Link href="/">
        <a className="link-style">Back &larr;</a>
      </Link>

      <h1 className="main-title">Stale projects</h1>

      {projects ? <ProjectList projects={projects} /> : <p>Loading...</p>}
    </Layout>
  );
}
