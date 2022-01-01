import Link from "next/link";

type Props = {
  name: string;
  project_id?: string;
};

export default function ProjectLink({ name, project_id }: Props) {
  if (project_id) {
    return (
      <Link href={`/projects/${project_id}`}>
        <a className="link-style">{name}</a>
      </Link>
    );
  }

  return <span>{name}</span>;
}
