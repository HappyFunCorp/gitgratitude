import Layout from 'components/layout';
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { prisma } from 'lib/prisma';
import { Repository } from '@prisma/client';
import { convertDates } from 'lib/repositories';
import Link from 'next/link';
import initSqlJS from 'sql.js/dist/sql-wasm'
import Script from 'next/script';
import Browser from 'components/browser';

type Props = {
  repo?: Repository
}

const RepoDetail = ({repo}: Props) => {
    return <Layout title="Repository">

      <Script type="module" strategy='beforeInteractive' src="/sql-loader.js"/>
      <Link href="/repositories"><a className="text-blue-600">Back &larr;</a></Link>
      <table>
        <tbody>
        <tr>
          <th>ID</th>
          <td>{repo.id}</td>
        </tr>
        <tr>
          <th>Remote</th>
          <td><a href={repo.remote}>{repo.remote}</a></td>
        </tr>
        <tr>
          <th>Created</th>
          <td>{repo.created}</td>
        </tr>
        <tr>
          <th>Last Processed</th>
          <td>{repo.last_proccessed}</td>
        </tr>

        <tr>
          <th>Last Changed</th>
          <td>{repo.last_changed}</td>
        </tr>
        <tr>
          <th>Duration</th>
          <td>{repo.duration}</td>
        </tr>
        <tr>
          <th>Summary DB</th>
          <td><a href={repo.summary_db_url}>{repo.summary_db_url}</a></td>
        </tr>
        <tr>
          <th>Log</th>
          <td><a href={repo.log_url}>{repo.log_url}</a></td>
        </tr>
        </tbody>
      </table>

      <Browser sqlliteURL={repo.summary_db_url}/>
    </Layout>
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const id = context.params.id;

    const repo = await prisma.repository.findFirst({
      select: {
        id: true,
        remote: true,
        private: true,
        valid: true,
        last_proccessed: true,
        last_changed: true,
        created: true,
        duration: true,
        summary_db_url: true,
        log_url: true
      },
      // @ts-ignore
      where: {id: id }
    })

    convertDates( repo );
    
    return {
      props: {
        repo,
      },
    };
  };
export default RepoDetail;