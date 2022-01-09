import Layout from "components/layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import ProjectLink from "components/project_link";
import ReleaseLink from "components/release_link";
import LockfileRefresh from "components/lockfile_refresh";
import { useDependancies, useLockfile } from "lib/hooks";
import { Strftime } from "components/strftime";

type Props = {
  lockfile_id: string;
};

export default function LockfileDetail({ lockfile_id }: Props) {
  const [lockfile, setLockfile] = useLockfile(lockfile_id);
  const [dependencies, setDependencies] = useDependancies(lockfile_id);

  if (!lockfile) {
    return (
      <Layout title="Lockfiles">
        <p className="main-title">Loading...</p>
      </Layout>
    );
  }
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
      <p>
        Uploaded At : <Strftime date={lockfile.uploadedAt} />
      </p>
      <p>
        Proccessed : <Strftime date={lockfile.processedAt} />
      </p>

      <LockfileRefresh lockfile={lockfile} />

      {dependencies && <DependenciesTable dependencies={dependencies} />}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.id;

  return { props: { lockfile_id: id } };
};

export function DependenciesTable({ dependencies }) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-left">Specified Version</th>
          <th className="text-left">Current Version</th>
          <th className="text-left">Synced</th>
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
            <td>
              <Strftime date={d.synced} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
