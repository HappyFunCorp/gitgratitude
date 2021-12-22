import Layout from "components/layout";
import Link from "next/link";
import fs from 'fs';
import { handle,json } from "next-runtime";

export default function Lockfiles({message}) {
    if (!message) {
        return <p>{message}</p>;
      }

      return (
        <Layout title="Lockfiles">
            <Link href="/"><a className="text-blue-600">Back &larr;</a></Link>


            <form method="post" encType="multipart/form-data">
                <input type="file" name="file" />
                <button type="submit">submit</button>
            </form>

        </Layout>
    )
}

export const getServerSideProps = handle({
    async upload({ file, stream }) {
      stream.pipe(fs.createWriteStream(`/tmp/${file.name}`));
    },
    async get({params,query}) {
        return json({message:"Select a file to upload"});
    }
})