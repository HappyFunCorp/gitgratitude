import React from "react";
import Link from "next/link";
import Layout from "components/layout";
import ProjectLookup from "components/project_lookup";
import ProjectList from "components/project_list";
import { useProjects } from "lib/hooks";

export default function Projects() {
  const [projects] = useProjects("all");

  return (
    <Layout title="Projects">
      <Link href="/">
        <a className="link-style">Back &larr;</a>
      </Link>
      <h1 className="main-title">Projects</h1>

      <ProjectLookup />
      <ProjectList projects={projects} />
    </Layout>
  );
}
