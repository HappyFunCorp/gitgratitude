import Layout from "components/layout";
import Link from "next/link";
import { handle, json, redirect } from "next-runtime";
import UploadFile from "components/uploadfile";
import { tryLockFile } from "lib/lockfiles";

export default function Lockfiles({ message }) {
  if (!message) {
    return <p>{message}</p>;
  }

  return (
    <Layout title="Lockfiles">
      <Link href="/">
        <a className="link-style">Back &larr;</a>
      </Link>

      <UploadFile />
    </Layout>
  );
}

type PageProps = any;

export const getServerSideProps = handle<PageProps>({
  uploadDir: "/tmp",

  async get({ params, query }) {
    return json({ message: "Select a file to upload" });
  },

  async post({ req: { body } }) {
    // @ts-expect-error
    const file: File = body.file;
    const lockfile = await tryLockFile(file);

    if (lockfile) {
      return redirect(`/lockfiles/${lockfile.id}`);
    } else {
      return json({ message: "Unable to parse lockfile" });
    }
  },
});
