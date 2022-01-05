import { Dependancy, Lockfile } from "@prisma/client";
import Layout from "components/layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { prisma } from "lib/prisma";
import { convertDates } from "lib/lockfiles";
import ProjectLink from "components/project_link";
import ReleaseLink from "components/release_link";
import LockfileRefresh from "components/lockfile_refresh";

type Props = {
  lockfile: Lockfile;
  dependencies?: Dependancy[];
};

export default function LockfileDetail({ lockfile, dependencies }: Props) {
  return (
    <Layout title="Lockfiles">
      <Link href="/lockfiles">
        <a className="link-style">Back &larr;</a>
      </Link>

      <h1 className="main-title">{lockfile.name}</h1>
      <p>FileType: {lockfile.file_type}</p>
      <p>Ecosystem: {lockfile.ecosystem}</p>
      <p>Valid? {lockfile.valid ? "Yes" : "No"}</p>
      <p>Parsed? {lockfile.parsed ? "Yes" : "No"}</p>
      <p>Uploaded At : {lockfile.uploadedAt}</p>
      <p>Proccessed : {lockfile.processedAt}</p>
      <p>
        <a
          href={`/api/parse_lockfile?id=${lockfile.id}`}
          className="btn-primary inline-block"
        >
          Parse it
        </a>
      </p>

      <LockfileRefresh lockfile={lockfile} />

      <p>Dependancies: {dependencies.length}</p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specified Version</th>
            <th>Current Version</th>
          </tr>
        </thead>
        <tbody>
          {dependencies.map((d) => (
            <tr key={d.id}>
              <td>
                <ProjectLink name={d.name} project_id={d.project_id} />
              </td>
              <td>
                <ReleaseLink project_id={d.project_id} version={d.version} />
              </td>
              <td>
                <ReleaseLink
                  project_id={d.project_id}
                  version={d.current_version}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.id;

  const lockfile = await prisma.lockfile.findFirst({
    select: {
      id: true,
      name: true,
      ecosystem: true,
      file_type: true,
      valid: true,
      parsed: true,
      uploadedAt: true,
      processedAt: true,
    },
    // @ts-ignore
    where: { id: id },
  });

  convertDates(lockfile);

  const dependencies = await prisma.dependancy.findMany({
    select: {
      name: true,
      version: true,
      current_version: true,
      project_id: true,
    },
    where: {
      lockfile_id: lockfile.id,
    },
    orderBy: { name: "asc" },
  });

  return { props: { lockfile, dependencies } };
};
