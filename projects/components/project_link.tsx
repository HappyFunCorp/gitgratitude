import { Project } from "@prisma/client";
import Link from "next/link";

type Props = {
  name: string;
  project?: Project;
};

export default function ProjectLink({ name, project }: Props) {
  if (project) {
    return (
      <Link href={`/projects/${project.id}`}>
        <a className="link-style">{name}</a>
      </Link>
    );
  }

  return <span>{name}</span>;
}
