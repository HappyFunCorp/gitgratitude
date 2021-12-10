import type { NextPage } from 'next'
import Layout from 'components/layout'
import Link from 'next/link';
import Card from 'components/card';

const Home: NextPage = () => {
  return (
    <Layout title="Home">
      <main className="flex flex-col p-4 justify-center items-center">
        <h1 className="text-5xl py-16 font-bold tracking-wide">
          Welcome to <Link href="/about"><a className="text-blue-600">git gratitude!</a></Link>
        </h1>

        <div className="flex flex-center w-full  items-center justify-around max-w-screen-lg flex-wrap pt-4">
          <Card href="/about" title="About" description="What's all this then?"/>
          <Card href="/projects" title="Projects" description="Lookup a project"/>
        </div>
      </main>
    </Layout>
  )
}

/*
          <Card href="/ecosystems" title="Ecosystems" description="See what's going on overall"/>
          <Card href="/community" title="Community" description="Lets look at people"/>
          <Card href="/repository" title="Reposities" description="Lets look at code"/>
*/

export default Home
