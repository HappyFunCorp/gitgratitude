import { useEffect, useState } from "react";

export default function useBinaryFile( url ) {
    const [dataFile, setDataFile] = useState(null)

    useEffect( () => {
        console.log( `Loading ${url}`)

        fetch(
            url
        ).then( (res) => {
            res.arrayBuffer().then( (data) => setDataFile( data ))
        })

        return () => { console.log( "Unmounted binary file") }
    }, [url]);

    return dataFile
}