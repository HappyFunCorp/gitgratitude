import type { NextPage } from "next";
import Layout from "components/layout";
import Link from "next/link";
import Card from "components/card";
import CardContainer from "components/card_container";

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <main className="flex flex-col p-4 justify-center items-center">
        <h1 className="main-title">
          Welcome to{" "}
          <Link href="/about">
            <a className="link-style">git gratitude!</a>
          </Link>
        </h1>

        <CardContainer>
          <Card
            href="/ecosystems"
            title="Ecosystems"
            description="Overview of what's in our database"
          />
          <Card
            href="/lockfiles"
            title="Lockfiles"
            description="Upload your lockfile"
          />
          <Card
            href="https://repositories.default.gitgratitude.com"
            title="Repositories"
            description="Look at a repo"
          />
          <Card
            href="/about"
            title="About"
            description="What's all this then?"
          />
        </CardContainer>
      </main>
    </Layout>
  );
};

/*
          <Card href="/ecosystems" title="Ecosystems" description="See what's going on overall"/>
          <Card href="/community" title="Community" description="Lets look at people"/>
          <Card href="/repository" title="Reposities" description="Lets look at code"/>
*/

export default Home;
