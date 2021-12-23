import type { NextPage } from 'next'
import React from 'react';
import Link from 'next/link'
import Layout from 'components/layout';
import ProjectLookup from 'components/projectlookup'
import ProjectList from 'components/projectlist'
import { prisma } from 'lib/prisma';
import { Project } from '.prisma/client';

// @ts-ignore
const Projects: NextPage = ({projects}) => {
    return (
        <Layout title="Projects">
            <Link href="/"><a className="text-blue-600">Back &larr;</a></Link>
            <h1 className="text-5xl py-4 font-bold tracking-wide">Projects</h1>


            <ProjectLookup/>
            <ProjectList projects={projects}/>
        </Layout>
    )
}

export const getServerSideProps = async () => {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        ecosystem_name: true,
        name: true,
        description: true,
        git: true,
        homepage: true
      },
      orderBy: [{
        latest_release: 'desc'
      }]
    })
  
    console.log(projects);
    
    return {
      props: {
        projects,
      },
    };
  };
  
export default Projects;