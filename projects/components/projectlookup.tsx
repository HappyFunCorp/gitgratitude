import React, {useState} from 'react';
import { useForm } from "react-hook-form";

export default function ProjectLookup({}) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [working, setWorking] = useState( false );
    const [status,  setStatus] = useState("");
    const [project, setProject] = useState();

    const onSubmit = async (data) => {
        if( data.name.length == 0 ) {
            setStatus( 'Please enter a project name' );
        } else {
            setStatus( `Looking up ${data.name}` );
            setWorking(true);

            const response = await fetch(`${window.location.origin}/api/project_lookup`, {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            });

            console.log( "Got response")
            setWorking( false );
            if( !response.ok ) {
                console.log( response.headers['content-type'] )
                if( response.headers['content-type'] == 'application/json' ) {
                    const json = await response.json();
                    setStatus( json.message )
                } else {
                    setStatus( `Bad server response: ${response.statusText}`)
                }
            } else {
                setStatus("Got a response")
                const data = await response.json();
                if( data.name ) {
                    setStatus( "Project found" );
                    setProject( data );
                } else {
                    setStatus( data.message )
                    setProject( null )
                }
            }
        
            console.log( response );
            }
        }
    
    return ( 
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="py-4">
            <select 
                {...register("ecosystem")}
                className="px-2 py-1 border-solid border-2 border-blue-600 rounded"
                name="ecosystem">
                <option value="rubygems">Ruby</option>
                <option value="npm">Node</option>
            </select>
            <input 
                {...register("name")}
                className="mx-2 px-2 py-1"
                type="text" 
                placeholder='Project Name'/>

            <button  type="submit" 
                    className="px-2 py-1 bg-blue-600 text-white rounded">
                {working ? 'Searching...' : 'Search'}

            </button>
        </form>
        { status ? <p>{status}</p> : <></>}
        { 
        project &&
        <dl>
            <dt>Name</dt>
            <dd>{// @ts-ignore
            project.name}</dd>
            <dt>Description</dt>
            <dd>{// @ts-ignore
            project.description}</dd>
            <dt>Homepage</dt>
            <dd><a href={// @ts-ignore
            project.homepage}>{project.homepage}</a></dd>
        </dl>
        }
        </>
  );
}