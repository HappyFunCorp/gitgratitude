import { prisma } from 'lib/prisma';
import { Buffer } from 'buffer';
import { Repository } from '.prisma/client';

export async function validGitData(data: Blob) {
    const dataAsString = await data.text();
    return dataAsString.match( "service=git-upload-pack" ) !== null
}

export async function createRepo( url: string, data: Blob ) {
    console.log( `${url} searching` )

    let repository = await prisma.repository.findFirst( {where: { remote: url } } );

    if( repository == null ) {
        console.log( `${url} not found, creating`)
        const bytes = await data.arrayBuffer()
        repository = await prisma.repository.create( {data: { remote: url, ref_bytes: Buffer.from(bytes) }} )
    } else {
        console.log( `${url} found`)
    }

    return repository;
}

/*
export async function syncProjectFromJson( ecoName: string, projectJson ) {
    console.log( `Updating ${ecoName}/${projectJson.name}`)

    let ecosystem = await prisma.ecosystem.findFirst( {where: { name: ecoName } } )

    if( ecosystem == null ) {
        ecosystem = await prisma.ecosystem.create( {data: {name: ecoName } } )
    }

    const existingProject = await prisma.project.findFirst( {
        where: {name: projectJson.name, ecosystem: ecosystem }
    })

    const data = {
        ecosystem_name: ecosystem.name,
        name: projectJson.name,
        homepage: projectJson.homepage,
        description: projectJson.description 
    }

    if( existingProject ) {
        const response = await prisma.project.update( 
            {
                where: {id: existingProject.id},
                data: data
            })
    } else {
        await prisma.project.create({ data: data })
    }
}
*/