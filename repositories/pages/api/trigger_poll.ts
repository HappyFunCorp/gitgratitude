import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { sendGitProcess } from 'lib/events';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.body;

    const repo = await prisma.repository.findFirst( {where: {id}} )

    console.log( `Looking for ${repo.remote}` )

    if( process.env.K_SINK ) {
        sendGitProcess( {remote: repo.remote} );

        res.status(200).json( {message: 'Sent'})
    } else {
        res.status(500).json( {message: 'K_SINK not set' } )
    }


}
