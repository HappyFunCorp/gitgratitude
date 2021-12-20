import axios from "axios";
import { CloudEvent, HTTP } from "cloudevents";
import { prisma } from 'lib/prisma';

export type WatchURL = {
    url: string
}

export type GitProcess = {
    remote: string
}

export type GitDone = {
    success: Boolean,
    repo: string,
    database: string,
    log: string,
    outkey: string,
    time_start: string,
    time_end: string,
    last_changed: string,
    created: string,
    root_sha: string,
    upload_end: string
  };

export function processEvent( event: CloudEvent ) {
    console.log(event);

    if(event.type == 'git.done') {
        return processGitDone( event.data );
    } else {
        console.log( `Unknown event type ${event.type}`)
    }
    return {error: true, message: 'unknown event' }
}

export async function processGitDone( gitDone:GitDone ) {
    gitDone.repo

    console.log( new Date( gitDone.time_start ) )

    const last_proccessed = new Date( gitDone.time_start )
    const last_changed = new Date( gitDone.last_changed )
    const created = new Date( gitDone.created );
    const end_time = new Date( gitDone.time_end );
    const duration = (end_time.getTime() - last_proccessed.getTime()) / 1000

    await prisma.repository.upsert( {
        where: { remote: gitDone.repo },
        update: {
            summary_db_url: gitDone.database,
            log_url: gitDone.log,
            last_proccessed: last_proccessed,
            last_changed,
            created,
            root_sha: gitDone.root_sha,
            duration,
        },
        create: {
            remote: gitDone.repo,
            summary_db_url: gitDone.database,
            log_url: gitDone.log,
            last_proccessed: last_proccessed,
            last_changed,
            created,
            root_sha: gitDone.root_sha,
            duration
        }
    } )

    return {error: false, message:
         'saved' }
    }

export function sendGitProcess( repo: GitProcess ) {
    console.log( `sending git.process for ${repo.remote}` )
    const ce = new CloudEvent( {type: 'git.process', source: '/repositories', data: repo })
    const message = HTTP.binary( ce );

    axios(process.env.K_SINK, {
        method: "post",
        data: message.body,
        // @ts-ignore
        headers: message.headers,
    });
}

export function sendWatchURL( url: WatchURL ) {
    console.log( `sending url.watch for ${url.url}` )

    const ce = new CloudEvent( {type: 'url.watch', source: '/repositories', data: url})
    const message = HTTP.binary( ce );

    axios(process.env.K_SINK, {
        method: "post",
        data: message.body,
        // @ts-ignore
        headers: message.headers,
    });
}
