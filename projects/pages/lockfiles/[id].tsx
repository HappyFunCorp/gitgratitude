import { Lockfile } from "@prisma/client";
import Layout from "components/layout";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { prisma } from "lib/prisma";

type Props = {
  lockfile: Lockfile;
};

export default function LockfileDetail({ lockfile }: Props) {
  return (
    <Layout title="Lockfiles">
      <Link href="/lockfiles">
        <a className="text-blue-600">Back &larr;</a>
      </Link>

      <h1 className="text-5xl py-4 font-bold tracking-wide">{lockfile.name}</h1>
      <p>FileType: {lockfile.file_type}</p>
      <p>Ecosystem: {lockfile.ecosystem}</p>
      <p>Valid? {lockfile.valid ? "Yes" : "No"}</p>
      <p>Parsed? {lockfile.parsed ? "Yes" : "No"}</p>
      <p>Uploaded At : {lockfile.uploadedAt}</p>
      <p>Proccessed : {lockfile.processedAt}</p>
      <p>
        <a
          href={`/api/parse_lockfile?id=${lockfile.id}`}
          className="bg-blue-600 text-white rounded hover:bg-blue-700 py-1 px-2"
        >
          Parse it
        </a>
      </p>
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

  return { props: { lockfile } };
};

function convertDates(lockfile: Lockfile) {
  // @ts-expect-error
  lockfile.uploadedAt = convertDate(lockfile.uploadedAt);

  // @ts-expect-error
  lockfile.processedAt = convertDate(lockfile.processedAt);
}

function convertDate(d: Date): String | null {
  if (d) {
    return `${d.getFullYear()}/${d.getMonth()}/${d.getDay()} ${d.getHours()}:${d.getMinutes()}`;
  }

  return null;
}