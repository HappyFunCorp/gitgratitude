import { prisma } from 'lib/prisma';

export default async function handler(req, res) {
    console.log( req.body );

    const {ecosystem, name} = req.body;

    if( ecosystem == 'rubygems' ) {
        if( process.env.ECO_RUBYGEMS_URL ) {
            const response = await fetch( `${process.env.ECO_RUBYGEMS_URL}/${name}` )
            if( response.ok ) {
                const json = await response.json();
                console.log( json );
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

/*
    const { content, title } = req.body;

  try {
    const feedback = await prisma.post.create({
      data: {
        content,
        title,
      },
    });
    res.status(200).json(feedback);
  } catch (error) {
    res.status(400).json({
      message: `Something went wrong :/ ${error}`,
    });
  }
}
*/