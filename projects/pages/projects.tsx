import type { NextPage } from 'next'
import React from 'react';
import Link from 'next/link'
import Layout from 'components/layout';
import ProjectLookup from 'components/projectlookup'
import { prisma } from 'lib/prisma';
import { Project } from '.prisma/client';

// @ts-ignore
const Projects: NextPage = ({projects}) => {
    return (
        <Layout title="Projects">
            <Link href="/"><a className="text-blue-600">Back &larr;</a></Link>
            <h1 className="text-5xl py-4 font-bold tracking-wide">Projects</h1>


            <ProjectLookup/>
            {projects.length == 0 ? <p>Nothing yet</p> : <p>Here are the projects</p>}
        </Layout>
    )
}

export const getServerSideProps = async () => {
    const projects = await prisma.project.findMany({
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