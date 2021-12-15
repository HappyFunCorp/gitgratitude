import Layout from 'components/layout';
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link';

export default function Repositories({ repos }) {
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
                        <td>{elem.last_pull}</td>
                        <td>{elem.valid}</td>
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
            last_pull: true,
            valid: true
        },
        where: {private: false}
    })

    return { props: {repos}};
}