import Link from "next/link";

type Props = {
  version: string;
  project_id?: string;
};

export default function ReleaseLink({ version, project_id }: Props) {
  // if (project_id) {
  //   return (
  //     <Link href={`/projects/${project_id}`}>
  //       <a className="link-style">{name}</a>
  //     </Link>
  //   );
  // }

  return <span>{version}</span>;
}
