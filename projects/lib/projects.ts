import { prisma } from 'lib/prisma';
import { Project } from '.prisma/client';

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