import Layout from 'components/layout';
import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'

//@ts-ignore
const RepoDetail : NextPage = ({repo}) => {
    const router = useRouter();
    const {id} = router.query;
    return <Layout title="Repository">
            <p>{id}</p>
            <p>{repo.remote}</p>
        </Layout>
}


export const getServerSideProps : GetServerSideProps = async (context) => {
    const id = context.params.id;

    const repo = await prisma.repository.findFirst({
      select: {
        remote: true,
        private: true,
        valid: true,
        last_pull: true
      },
      // @ts-ignore
      where: {id: id }
    })

    return {
      props: {
        repo,
      },
    };
  };
export default RepoDetail;