import Layout from 'components/layout';
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { prisma } from 'lib/prisma';
import { Repository } from '@prisma/client';

type Props = {
  repo?: Repository
}

const RepoDetail = ({repo}: Props) => {

    return <Layout title="Repository">
      <table>
        <tr>
          <th>ID</th>
          <td>{repo.id}</td>
        </tr>
        <tr>
          <th>Remote</th>
          <td><a href={repo.remote}>{repo.remote}</a></td>
        </tr>
        <tr>
          <th>Last Processed</th>
          <td>{repo.last_proccessed}</td>
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
      </table>
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
        duration: true,
        summary_db_url: true,
        log_url: true
      },
      // @ts-ignore
      where: {id: id }
    })

    if( repo && repo.last_proccessed ) {
      const r = repo.last_proccessed

      // @ts-ignore
      repo.last_proccessed = `${r.getFullYear()}/${r.getMonth()}/${r.getDay()} ${r.getHours()}:${r.getMinutes()}`
    }

    console.log( repo.last_proccessed )
    return {
      props: {
        repo,
      },
    };
  };
export default RepoDetail;