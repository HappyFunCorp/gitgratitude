import Layout from 'components/layout';
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link';
import { prisma } from 'lib/prisma';
import { Repository } from '.prisma/client';

type Props = {
    repos?: Repository[]
  }

export default function Repositories({ repos }:Props) {
return(
    <Layout title="Repositories">
        <table>
            <thead>
                <tr>
                    <th>Remote</th>
                    <th>Last Pull</th>
                    <th>Valid</th>
                </tr>
            </thead>
            <tbody>
                {repos.map( (elem) => (
                    <tr key={elem.id}>
                        <td><Link href={`/repositories/${elem.id}`}><a className="text-blue-600 underline">{elem.remote}</a></Link></td>
                        <td>{elem.last_proccessed.toString()}</td>
                        <td>{elem.valid}</td>
                        <td><a href={`/api/trigger_poll?id=${elem.id}`}>Trigger poll</a></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Layout>
)
}

export const getServerSideProps : GetServerSideProps = async (context) => {
    const repos = await prisma.repository.findMany( {
        select: {
            id: true,
            remote: true,
            last_proccessed: true,
            valid: true
        },
        where: {private: false}
    })

    for( let i = 0; i < repos.length; i++ ) {
        const r = repos[i].last_proccessed

        if(r) {
            // @ts-ignore
            repos[i].last_proccessed = `${r.getFullYear()}/${r.getMonth()}/${r.getDay()} ${r.getHours()}:${r.getMinutes()}`
        }
    }

    return { props: {repos}};
}