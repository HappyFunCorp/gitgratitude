import type { NextPage } from "next";
import Layout from "components/layout";
import Link from "next/link";

const About: NextPage = () => {
  return (
    <Layout title="About">
      <Link href="/">
        <a className="link-style">Back &larr;</a>
      </Link>
      <h1 className="main-title">About</h1>

      <p>{"That's how we build apps"}</p>
    </Layout>
  );
};

export default About;
