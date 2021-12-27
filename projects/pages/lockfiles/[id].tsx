import { Lockfile } from "@prisma/client";
import { GetServerSideProps } from "next";

type Props = {
  lockfile: Lockfile;
};

export default function LockfileDetail({ lockfile }: Props) {
  return <h1>{lockfile.name}</h1>;
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params.id;

  const repo = await prisma.lockfile.findFirst({
    select: {
      id: true,
      name: true,
      file_type: true,
      valid: true,
      parsed: true,
      uploadedAt: true,
      processedAt: true,
    },
    // @ts-ignore
    where: { id: id },
  });

  return { props: { repo } };
};
