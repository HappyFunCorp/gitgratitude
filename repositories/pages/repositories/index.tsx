import Layout from 'components/layout';
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link';
import { prisma } from 'lib/prisma';
import { convertDates } from 'lib/repositories';
import { Repository } from '@prisma/client';

type Props = {
    repos?: Repository[]
  }

export default function Repositories({ repos }:Props) {
return(
    <Layout title="Repositories">
        <Link href="/"><a className="text-blue-600">Back &larr;</a></Link>

        <table className="w-full">
            <thead>
                <tr>
                    <th>Remote</th>
                    <th>Last Changed</th>
                    <th>Last Processed</th>
                    <th>Created</th>
                    <th>Valid</th>
                </tr>
            </thead>
            <tbody>
                {repos.map( (elem) => (
                    <tr key={elem.id}>
                        <td><Link href={`/repositories/${elem.id}`}><a className="text-blue-600 dark:text-blue-200 underline">{elem.remote}</a></Link></td>
                        <td>{elem.last_changed}</td>
                        <td>{elem.last_proccessed}</td>
                        <td>{elem.created}</td>
                        <td>{elem.valid}</td>
                        <td><a className="bg-blue-600 text-white px-4 py-2 rounded mt-2 inline-block" href={`/api/trigger_poll?id=${elem.id}`}>Trigger poll</a></td>
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
            last_changed: true,
            created: true,
            valid: true
        },
        where: {private: false}
    })

    for( let i = 0; i < repos.length; i++ ) {
        // @ts-ignore
        convertDates(repos[i])
    }

    return { props: {repos}};
}