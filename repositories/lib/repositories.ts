import { prisma } from 'lib/prisma';
import { Buffer } from 'buffer';
import { Repository } from '.prisma/client';
import md5 from 'blueimp-md5';

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

        const hash = md5(bytes);
        repository = await prisma.repository.create( {data: { remote: url, refs_hash: hash}} )
    } else {
        console.log( `${url} found`)
    }

    return repository;
}


export function convertDates(repo: Repository) {
    // @ts-ignore
    repo.last_changed = convertDate( repo.last_changed );
    
    // @ts-ignore
    repo.created = convertDate( repo.created );
    
    // @ts-ignore
    repo.last_proccessed = convertDate( repo.last_proccessed );
}

function convertDate( d: Date ):String {
    if(d) {
        return `${d.getFullYear()}/${d.getMonth()}/${d.getDay()} ${d.getHours()}:${d.getMinutes()}`
    } 

    return null;
}