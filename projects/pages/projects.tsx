import type { NextPage } from "next";
import React from "react";
import Link from "next/link";
import Layout from "components/layout";
import ProjectLookup from "components/projectlookup";
import ProjectList from "components/projectlist";
import { prisma } from "lib/prisma";
import { Project } from "@prisma/client";

type Props = {
  projects: Project[];
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
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      ecosystem: true,
      name: true,
      description: true,
      git: true,
      homepage: true,
    },
    orderBy: [
      {
        latest_release: "desc",
      },
    ],
  });

  return {
    props: {
      projects,
    },
  };
};
