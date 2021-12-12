import React from 'react'

export default function ProjectList({projects}) {
    if( projects.length == 0 ) {
        return <p>No projects</p>
    }

    return (
        <table>
            <tbody>
            <tr><th>Name</th><th>Homepage</th><th>Description</th></tr>
            { projects.map( (e) =>
            <tr key={e.id}><td>{e.name}</td><td>{e.homepage}</td><td>{e.description}</td></tr>
            )}
            </tbody>
        </table>
    )
}