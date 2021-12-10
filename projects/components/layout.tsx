import React from 'react';
import Head from 'next/head'

export default function Layout({ children,title }) {
    let titleString = "Git Gratitude";
    if( title !== undefined ) {
        titleString = `${titleString}: ${title}`
    }
    return (
      <>
        <div className="container mx-auto">
            <Head>
                <title>{titleString}</title>
                <meta name="description" content="Who is building your app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {children}
        </div>
      </>
    )
  }