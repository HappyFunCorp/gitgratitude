import type { GetServerSideProps, NextPage } from "next";
import React from "react";
import Link from "next/link";
import Layout from "components/layout";
import ProjectLookup from "components/projectlookup";
import ProjectList from "components/projectlist";
import { prisma } from "lib/prisma";
import { Ecosystem, lookupEcosystem } from "lib/ecosystem";
import { Project } from "@prisma/client";

type Props = {
  ecosystem: Ecosystem;
  projects: Project[];
};

export default function Projects({ ecosystem, projects }: Props) {
  return (
    <Layout title="Projects">
      <Link href="/ecosystems">
        <a className="link-style">Back &larr;</a>
      </Link>
      <h1 className="main-title">{ecosystem.name} packages</h1>

      <ProjectLookup ecosystem={ecosystem} />
      <ProjectList projects={projects} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.params.name;

  const ecosystem = lookupEcosystem(`${name}`);

  const projects = await prisma.project.findMany({
    select: {
      id: true,
      ecosystem: true,
      name: true,
      description: true,
      git: true,
      homepage: true,
    },
    where: { ecosystem: ecosystem.enum },
    orderBy: [
      {
        latest_release: "desc",
      },
    ],
  });

  return {
    props: {
      ecosystem,
      projects,
    },
  };
};
