import { syncProjectFromJson } from 'lib/projects';

export default async function handler(req, res) {
    const {ecosystem, name} = req.body;
    console.log( `Looking up ${ecosystem}/${name}`)


    if( ecosystem == 'rubygems' ) {
        if( process.env.ECO_RUBYGEMS_URL ) {
            const response = await fetch( `${process.env.ECO_RUBYGEMS_URL}/${name}` )
            if( response.ok ) {
                const json = await response.json();
                syncProjectFromJson( ecosystem, json );
                res.status(200).json( json );
    
            } else {
                console.log( response )
                res.status(response.status).json( {message: 'Error from server'})
            }

        } else {
            res.status(200).json( {message:'Internal misconfiguration, ECO_RUBYGEMS_URL undefined'});
        }

    } else {
        res.status(200).json( {message: `Unknown ecosystem ${ecosystem}`} )
    }

}
