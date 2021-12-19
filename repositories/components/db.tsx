import { Component, useEffect, useState } from "react"

export default function Db( {sqlliteURL,children} ) {
    const [dataFile, setDataFile] = useState(null)
    const [db, setDb] = useState()
    const [render, setRender] = useState(false)

    // Only run this in the browser
    if (typeof window !== 'undefined') {
        useEffect( () => {
            console.log( "Should try initSQLJS")
            // @ts-ignore
            window.loadSQL().then( (db) => {
                console.log( "I have the database" )
                setDb( db )
            })

            //window.initSqlJS( {locateFile: async file => `./${file}`}).then( SQL => {console.log( "Loaded sql")})
            return () => {} 
        }, [] )
    }

    useEffect( () => {
        console.log( "Calling fetch")

        fetch(
            sqlliteURL,
            { mode: 'no-cors' }
        ).then( (res) => {
            console.log( 'Done')
        
            setDataFile( res.arrayBuffer() );
        })

        return () => { console.log( "Unmounted") }
    }, []);

    useEffect( () => {
        console.log( "checkling render...")
        setRender( db && dataFile)
    }, [db,dataFile])

    console.log("Children is", children)

    return (
        <>
        { !db && <p>Downloading SQLite...</p> }
        { !dataFile && <p>Downloading database...</p> }
        <p>{sqlliteURL}</p>
        { render && children }
        </>
    )
}
