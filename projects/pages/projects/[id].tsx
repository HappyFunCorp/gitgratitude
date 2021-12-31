import { Project } from "@prisma/client";
import Layout from "components/layout";
import ReleaseList from "components/release_list";
import { convertDate } from "lib/lockfiles";
import { GetServerSideProps } from "next";
import Link from "next/link";

export default function ProjectPage({ project }) {
  return (
    <Layout title="Project detail page">
      <Link href={`/ecosystems/${project.ecosystem}`}>
        <a className="link-style">Back to {project.ecosystem} &larr;</a>
      </Link>
      <h1 className="main-title">
        {project.ecosystem}/{project.name}
      </h1>

      <table className="w-full">
        <tbody>
          <tr>
            <th>Homepage</th>
            <td>
              <a href={project.homepage} className="link-style">
                {project.homepage}
              </a>
            </td>
          </tr>
          {project.summary && (
            <tr>
              <th>Summary</th>
              <td>{project.summary}</td>
            </tr>
          )}
          <tr>
            <th>Description</th>
            <td>{project.description}</td>
          </tr>
          <tr>
            <th>Repo</th>
            <td>{project.git}</td>
          </tr>
        </tbody>
      </table>

      <ReleaseList releases={project.Release} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.id;

  console.log(`Looking up project ${id}`);
  const project = await prisma.project.findFirst({
    select: {
      id: true,
      name: true,
      ecosystem: true,
      homepage: true,
      summary: true,
      description: true,
      git: true,
      first_release: true,
      latest_release: true,
      latest_version: true,
      Release: true,
    },
    // @ts-ignore
    where: { id: id },
  });

  // console.log(project);
  convertProjectDates(project);

  return { props: { project } };
};

function convertProjectDates(project: Project) {
  // @ts-expect-error
  project.first_release = convertDate(project.first_release);

  // @ts-expect-error
  project.latest_release = convertDate(project.latest_release);

  // @ts-expect-error
  for (const r of project.Release) {
    r.released = convertDate(r.released);
  }
}
