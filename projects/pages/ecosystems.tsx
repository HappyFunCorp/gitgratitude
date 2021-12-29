import type { NextPage } from "next";
import React from "react";
import Link from "next/link";
import Layout from "components/layout";
import { prisma } from "lib/prisma";
import Card from "components/card";
import CardContainer from "components/card_container";

// @ts-ignore
const Ecosystems: NextPage = ({ ecosystems }) => {
  return (
    <Layout title="Ecosystems">
      <Link href="/">
        <a className="link-style">Back &larr;</a>
      </Link>
      <h1 className="main-title">Ecosystems</h1>

      <CardContainer>
        {ecosystems.map((e) => (
          <Card
            href={`/ecosystems/${e.ecosystem}`}
            title={e.ecosystem}
            description={`${e._count} packages tracked`}
          />
        ))}
        <Card
          href="/ecosystems/add"
          title="Add a new ecosystem"
          description="I want to add another"
        />
      </CardContainer>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const ecosystems = await prisma.project.groupBy({
    by: ["ecosystem"],
    _count: true,
  });

  console.log(ecosystems);
  return {
    props: {
      ecosystems,
    },
  };
};

export default Ecosystems;
