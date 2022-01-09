import Layout from "components/layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import ProjectLink from "components/project_link";
import ReleaseLink from "components/release_link";
import LockfileRefresh from "components/lockfile_refresh";
import { useDependancies, useLockfile } from "lib/hooks";
import { Strftime } from "components/strftime";
import { useEffect, useState } from "react";

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
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("name");
  const [deps, setDeps] = useState(dependencies);
  useEffect(() => {
    // filter
    const ds = new Array();
    for (const d of dependencies) {
      if (filter == "outdated") {
        if (d.version != d.current_version) {
          ds.push(d);
        }
      } else {
        ds.push(d);
      }
    }

    // sort
    if (sort == "name") {
      ds.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort == "version") {
      ds.sort((a, b) => a.version.localeCompare(b.version));
    }

    if (sort == "date") {
      ds.sort((a, b) => {
        if (a.release && b.release) {
          return a.release.released.localeCompare(b.release.released);
        }

        return 0;
      });
    }

    setDeps(ds);
  }, [filter, sort]);

  return (
    <div>
      <div className="flex justify-around py-4">
        <button className="btn-primary" onClick={() => setFilter("all")}>
          All
        </button>
        <button className="btn-primary" onClick={() => setFilter("outdated")}>
          outdated
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">
              <a onClick={() => setSort("name")}>Name</a>
            </th>
            <th className="text-left">
              <a onClick={() => setSort("version")}>Specified Version</a>
            </th>
            <th className="text-left">Current Version</th>
            <th className="text-left" onClick={() => setSort("date")}>
              Released
            </th>
            <th className="text-left" onClick={() => setSort("synced")}>
              Synced
            </th>
          </tr>
        </thead>
        <tbody>
          {deps.map((d) => (
            <tr key={d.id}>
              <td>
                <ProjectLink name={d.name} project={d.project} />
              </td>
              <td>
                <ReleaseLink release={d.release} version={d.version} />
              </td>
              <td>
                <span className="text-mono">
                  {d.project && d.project.latest_version}
                </span>
              </td>
              <td>{d.release && <Strftime date={d.release.released} />}</td>
              <td>
                <Strftime date={d.synced} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
