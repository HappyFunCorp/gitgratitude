import { Project, Release } from "@prisma/client";
import Layout from "components/layout";
import ProjectRefresh from "components/project_refresh";
import ReleaseList from "components/release_list";
import { convertDate } from "lib/lockfiles";
import { GetServerSideProps } from "next";
import Link from "next/link";

type Props = {
  project: Project;
  releases: Release[];
};
export default function ProjectPage({ project, releases }: Props) {
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
            <td>{project.latest_release}</td>
          </tr>
          <tr>
            <th>Latest Version</th>
            <td>{project.latest_version}</td>
          </tr>
          <tr>
            <th>First Released</th>
            <td>{project.first_release}</td>
          </tr>
        </tbody>
      </table>

      <ProjectRefresh project={project} />
      <ReleaseList releases={releases} />
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
    },
    // @ts-ignore
    where: { id: id },
  });

  // console.log(project);
  convertProjectDates(project);

  const releases = await prisma.release.findMany({
    select: { id: true, version: true, released: true, sha: true },
    where: { project_id: project.id },
    orderBy: { released: "desc" },
  });

  // @ts-expect-error
  convertReleaseDates(releases);

  return { props: { project, releases } };
};

function convertProjectDates(project: Project) {
  // @ts-expect-error
  project.first_release = convertDate(project.first_release);

  // @ts-expect-error
  project.latest_release = convertDate(project.latest_release);
}

function convertReleaseDates(releases: Release[]) {
  for (const r of releases) {
    // @ts-expect-error
    r.released = convertDate(r.released);
  }
}
