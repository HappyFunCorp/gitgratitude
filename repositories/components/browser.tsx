import { useState } from "react";
import useBinaryFile from "./useBinaryFile";
import { useDB, useDBQuery } from "./useDB";

const queries = [
    "select * from commits",
    "select * from authors"
]
export default function Browser( {sqlliteURL}) {
    const data = useBinaryFile( sqlliteURL )
    const db = useDB(data);
    const [query, setQuery] = useState( "SELECT name FROM  sqlite_schema WHERE type ='table' AND name NOT LIKE 'sqlite_%';" )
    const results = useDBQuery( db, query )

    if( !data ) return <p>Loading database file ...</p>
    if( !db ) return <p>Loading database engine ...</p>

    return (
    <div className="flex">
        <div className="flex-none max-w-1/3">
            <ul>
            {queries.map( q => (
                <li key={q}><a onClick={() => setQuery(q)}>{q}</a></li>
            ))}
            </ul>
        </div>
        <div className="flex-1">
            <p>{query}</p>
            <ResultTable results={results}/>
        </div>
    </div>
    )
}

export function ResultTable( {results} ) {
    if( !results ) {
        return <div></div>
    }
    return (
        <table className="w-full">
            <thead>
                <tr>
                    {results[0].columns.map( (c) => <th key={c}>{c}</th>)}
                </tr>
            </thead>
            <tbody>
                {results[0].values.map( (r) => <tr key={r}>
                    {r.map( (v) => <td key={v}>{v}</td> )}
                </tr>)}
            </tbody>
        </table>
    )
}
