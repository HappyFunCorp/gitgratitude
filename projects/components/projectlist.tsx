import React from 'react'

export default function ProjectList({projects}) {
    if( projects.length == 0 ) {
        return <p>No projects</p>
    }

    return (
        <table className="w-full">
            <tbody>
            <tr><th>Name</th><th>Homepage</th><th>Repository</th><th>Description</th></tr>
            { projects.map( (e) =>
            <tr key={e.id}><td>{e.name}</td><td>{e.homepage}</td><td>{e.git}</td><td>{e.description}</td></tr>
            )}
            </tbody>
        </table>
    )
}