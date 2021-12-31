import React from "react";
import Link from "next/link";
import Layout from "components/layout";
import ProjectLookup from "components/project_lookup";
import ProjectList from "components/project_list";
import { Project } from "@prisma/client";
import { lookupProjects, ProjectListDTO } from "lib/projects";

type Props = {
  projects: ProjectListDTO[];
};

export default function Projects({ projects }: Props) {
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

export const getServerSideProps = async () => {
  const projects = await lookupProjects();

  return {
    props: {
      projects,
    },
  };
};
