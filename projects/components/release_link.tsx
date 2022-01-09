import { Release } from "@prisma/client";
import Link from "next/link";

type Props = {
  version: string;
  release?: Release;
};

export default function ReleaseLink({ version, release }: Props) {
  if (release) {
    return (
      <Link href={`/projects/${release.project_id}`}>
        <a className="link-style">{version}</a>
      </Link>
    );
  }

  return <span>{version}</span>;
}
