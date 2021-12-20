import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { sendGitProcess } from 'lib/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.id;

    if( id ) {
        // @ts-expect-error
        const repo = await prisma.repository.findFirst( {where: {id}} )

        if( process.env.K_SINK ) {
            sendGitProcess( {remote: repo.remote} );

            res.redirect( `/repositories/${repo.id}?poll=true`)
        } else {
            res.status(500).json( {message: 'K_SINK not set' } )
        }
    } else {
        res.status(404).json( {message: 'id not specified'} )
    }
}
