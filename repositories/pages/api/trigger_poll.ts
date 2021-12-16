import { NextApiRequest, NextApiResponse } from 'next';
import { CloudEvent, HTTP } from 'cloudevents';
import axios from 'axios';
import { prisma } from 'lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.body;

    const repo = await prisma.repository.findFirst( {where: {id}} )

    console.log( `Looking for ${repo.remote}` )

    if( process.env.K_SINK ) {
        const ce = new CloudEvent( {type: 'git.process', source: '/repositories', data: { remote: repo.remote  }})
        const message = HTTP.binary( ce );

        axios(process.env.K_SINK, {
            method: "post",
            data: message.body,
            // @ts-ignore
            headers: message.headers,
        });

        res.status(200).json( {message: 'Sent'})
    } else {
        res.status(500).json( {message: 'K_SINK not set' } )
    }


}
