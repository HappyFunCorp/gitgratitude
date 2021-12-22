import { syncProjectFromJson } from 'lib/projects';

export default async function handler(req, res) {
    const {ecosystem, name} = req.body;
    console.log( `Looking up ${ecosystem}/${name}`)

    if( ecosystem == 'rubygems' ) {
        if( process.env.ECO_RUBYGEMS_URL ) {
            const url = new URL( process.env.ECO_RUBYGEMS_URL );
            url.searchParams.append( 'package', name )
            const response = await fetch( url.href )
            if( response.ok ) {
                const json = await response.json();
                syncProjectFromJson( ecosystem, json );
                res.status(200).json( json );
    
            } else {
                const json = await response.json()
                console.log( json )
                res.status(response.status).json( json )
            }

        } else {
            res.status(200).json( {message:'Internal misconfiguration, ECO_RUBYGEMS_URL undefined'});
        }

    } else {
        res.status(200).json( {message: `Unknown ecosystem ${ecosystem}`} )
    }

}
