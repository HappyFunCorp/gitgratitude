import Layout from "components/layout";
import Link from "next/link";

export default function AddEcosystemPage() {
  return (
    <Layout title="Adding an ecosystem">
      <Link href="/ecosystems">
        <a className="link-style">Back &larr;</a>
      </Link>

      <h1 className="main-title">How to add an ecosystem</h1>
      <p>
        TODO: Write up these docs, but check out the source code at{" "}
        <a
          className="link-style"
          href="https://github.com/HappyFunCorp/gitgratitude"
        >
          on github
        </a>{" "}
        and look around!
      </p>
    </Layout>
  );
}
