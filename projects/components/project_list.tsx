import { Project } from "@prisma/client";
import { Ecosystem } from "lib/ecosystem";
import Link from "next/link";
import React from "react";
import { Strftime } from "./strftime";

type Props = {
  ecosystem?: Ecosystem;
  projects: Project[];
};

export default function ProjectList({ ecosystem, projects }: Props) {
  if (!projects || projects.length == 0) {
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
          <th>Last Synced</th>
        </tr>
        {projects.map((e) => (
          <tr key={e.id}>
            {!ecosystem && <td>{e.ecosystem}</td>}
            <td>
              <Link href={`/projects/${e.id}`}>
                <a className="link-style">{e.name}</a>
              </Link>
            </td>
            <td>
              {
                // @ts-expect-error
                e.releases
              }
            </td>
            <td>{e.latest_version}</td>
            <td>
              <Strftime date={e.latest_release} />
            </td>
            <td>
              <Strftime date={e.last_synced} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
