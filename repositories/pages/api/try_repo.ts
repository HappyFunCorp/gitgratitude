import { URL } from 'url'
import { validGitData, createRepo } from 'lib/repositories';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {url} = req.body;
    console.log( `${url} Looking up`)

    try {
        const u = new URL( url );
    } catch( TypeError ) {
        res.status(200).json( { error: true, message: "Not a valid url!"} )
        return
    }

    const result = await fetch( `${url}/info/refs?service=git-upload-pack`)

    if( !result.ok ) {
        res.status(200).json( { error: true, message: `Doesn't look like a repo ${result.status}`})
        return
    }

    const data = await result.blob();

    console.log(`${result.url} was returned`)

    const resolved_url = result.url.replace( "/info/refs?service=git-upload-pack","")

    if( validGitData( data ) ) {
        const repo = await createRepo( resolved_url, data);

        res.status(200).json( {error: false, message: "Found it!", id: repo.id} )
        return
    }
    console.log( result.url );
    console.log( await result.text() )

    res.status(200).json( { error: "True", message: "Didn't find valid git data" })
}