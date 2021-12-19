import { useEffect, useState } from "react"

export function useDB(data) {
    const [engine, setEngine] = useState(null)
    const [db, setDB] = useState(null)
    // Only run this in the browser
    if (typeof window !== 'undefined') {
        useEffect( () => {
            console.log( "Should try initSQLJS")
            // @ts-ignore
            window.loadSQL().then( (db) => {
                console.log( "I have the database" )
                setEngine( db )
            })

            return () => {} 
        }, [] )
    }

    useEffect( () => {
        if( engine && data ) {
            console.log( "Starting up the engine")

            // @ts-ignore
            setDB( new engine.Database(new Uint8Array(data) ))
        }

        return () => {}
    }, [data,engine] )

    return db
}

export function useDBQuery( db, data, query ) {
    const [results, setResults] = useState(null)

    useEffect( () => {
        if( db && data ) {
            console.log( `Running query ${query}`)
            const r = db.exec(query)
            console.log(r)
            // @ts-ignore
            window.results = r;
            setResults( r )
        }
    }, [db, data, query])

    return results;
}
