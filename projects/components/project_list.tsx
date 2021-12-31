import { Ecosystem } from "lib/ecosystem";
import { ProjectListDTO } from "lib/projects";
import Link from "next/link";
import React from "react";

type Props = {
  ecosystem?: Ecosystem;
  projects: ProjectListDTO[];
};

export default function ProjectList({ ecosystem, projects }: Props) {
  if (projects.length == 0) {
    return <p>No projects</p>;
  }

  return (
    <table className="w-full">
      <tbody>
        <tr>
          {!ecosystem && <th>Eco</th>}
          <th>Name</th>
          <th>Releases</th>
          <th>Latest Version</th>
          <th>Latest Release</th>
        </tr>
        {projects.map((e) => (
          <tr key={e.id}>
            {!ecosystem && <td>{e.ecosystem}</td>}
            <td>
              <Link href={`/projects/${e.id}`}>
                <a className="link-style">{e.name}</a>
              </Link>
            </td>
            <td>{e.releases}</td>
            <td>{e.latest_version}</td>
            <td>{e.latest_release}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
