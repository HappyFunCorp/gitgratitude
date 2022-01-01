import type { GetServerSideProps, NextPage } from "next";
import React from "react";
import Link from "next/link";
import Layout from "components/layout";
import ProjectLookup from "components/project_lookup";
import ProjectList from "components/project_list";
import { Ecosystem, lookupEcosystem } from "lib/ecosystem";
import { lookupProjects, ProjectListDTO } from "lib/projects";

type Props = {
  ecosystem: Ecosystem;
  projects: ProjectListDTO[];
};

export default function Projects({ ecosystem, projects }: Props) {
  return (
    <Layout title="Projects">
      <Link href="/ecosystems">
        <a className="link-style">Back to ecosystems &larr;</a>
      </Link>
      <h1 className="main-title">{ecosystem.name} packages</h1>

      <ProjectLookup ecosystem={ecosystem} />
      <ProjectList ecosystem={ecosystem} projects={projects} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.params.name;

  const ecosystem = lookupEcosystem(`${name}`);

  const projects = await lookupProjects(ecosystem);

  return {
    props: {
      ecosystem,
      projects,
    },
  };
};
