import { Project, Release } from "@prisma/client";
import Layout from "components/layout";
import ProjectRefresh from "components/project_refresh";
import ReleaseList from "components/release_list";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { useProject, useReleases } from "lib/hooks";
import { Strftime } from "components/strftime";

type Props = {
  id: number;
};

export default function ProjectPage({ id }: Props) {
  const [project, setProject] = useProject(id);
  const [releases] = useReleases(project);

  if (!project) {
    return (
      <Layout title="Project detail page">
        <p className="main-title">Loading</p>
      </Layout>
    );
  }
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
          <tr>
            <th>Latest Release</th>
            <td>
              <Strftime date={project.latest_release} />
            </td>
          </tr>
          <tr>
            <th>Latest Version</th>
            <td className="font-mono">{project.latest_version}</td>
          </tr>
          <tr>
            <th>First Released</th>
            <td>
              <Strftime date={project.first_release} />
            </td>
          </tr>
          <tr>
            <th>Last Synced</th>
            <td>
              <Strftime date={project.last_synced} />
            </td>
          </tr>
        </tbody>
      </table>

      <ProjectRefresh project={project} setProject={setProject} />

      {releases && <ReleaseList releases={releases} />}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.id;

  return { props: { id } };
};
