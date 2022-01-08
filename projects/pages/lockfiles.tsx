import Layout from "components/layout";
import Link from "next/link";
import { handle, json, redirect } from "next-runtime";
import UploadFile from "components/uploadfile";
import { tryLockFile } from "lib/lockfiles";
import LockfileList from "components/lockfile_list";
import { useLockfileList } from "lib/hooks";

type PageProps = { message?: string };

export default function Lockfiles({ message }) {
  const [lockfiles] = useLockfileList();

  return (
    <Layout title="Lockfiles">
      <Link href="/">
        <a className="link-style">Back &larr;</a>
      </Link>

      <h1 className="main-title">Lockfiles</h1>

      <UploadFile />

      {lockfiles && (
        <LockfileList lockfiles={lockfiles} title="Recent Lockfiles" />
      )}
    </Layout>
  );
}

export const getServerSideProps = handle<PageProps>({
  uploadDir: "/tmp",

  async get() {
    return json({ message: "Hi" });
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
