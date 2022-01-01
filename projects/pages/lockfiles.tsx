import Layout from "components/layout";
import Link from "next/link";
import { handle, json, redirect } from "next-runtime";
import UploadFile from "components/uploadfile";
import {
  LockfileListDTO,
  lockfileListWithCounts,
  tryLockFile,
} from "lib/lockfiles";
import LockfileList from "components/lockfile_list";

type PageProps = { lockfiles?: LockfileListDTO[]; message?: string };

export default function Lockfiles({ message, lockfiles }) {
  return (
    <Layout title="Lockfiles">
      <Link href="/">
        <a className="link-style">Back &larr;</a>
      </Link>

      <h1 className="main-title">Lockfiles</h1>

      <UploadFile />

      <LockfileList lockfiles={lockfiles} title="Recent Lockfiles" />
    </Layout>
  );
}

export const getServerSideProps = handle<PageProps>({
  uploadDir: "/tmp",

  async get() {
    const lockfiles = await lockfileListWithCounts();
    return json({ message: "Hi", lockfiles });
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
