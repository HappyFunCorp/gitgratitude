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
        <a className="text-blue-600">Back &larr;</a>
      </Link>

      <UploadFile />
    </Layout>
  );
}

export const getServerSideProps = handle({
  async upload({ file, stream }) {
    const lockfile = await tryLockFile(file, stream);

    if (lockfile) {
      console.log(`Redirecting to /lockfiles/${lockfile.id}`);
      return redirect(`/lockfiles/${lockfile.id}`);
    } else {
      console.log(`No lockfile`);
      return json({ message: "Unable to parse lockfile" });
    }
  },
  async get({ params, query }) {
    return json({ message: "Select a file to upload" });
  },
});
