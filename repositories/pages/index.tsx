import React, {useState} from 'react';
import type { GetServerSideProps, NextPage } from 'next'
import Layout from 'components/layout'
import Spinner from 'components/spinner'
import Link from 'next/link';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';
import { handle, json } from 'next-runtime';
import { HTTP } from 'cloudevents';

const Home: NextPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [ loading, setLoading ] = useState( false )
  const [ message, setMessage ] = useState( "" )
  const [ triggered, setTriggered ] = useState( false );
  const router = useRouter();

  const { remote } = router.query;

  const onSubmit = async (data) => {
    console.log( data )
    setLoading( true )
    setMessage( "Loading..." )

    const response = await fetch( `${window.location.origin}/api/try_repo`,{
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST', 
    } )

    setLoading( false )

    if( response.ok ) {
      const data = await response.json();
      console.log( data );
      if( data.message ) {
        setMessage( data.message )
        if( !data.error ) {
          router.push(`repositories/${data.id}`)
        }
      } else {
        setMessage( "Bad response" )
      }
    }  
  }

  if( remote && !triggered ) {
    setTriggered(true);
    console.log( `Looking up ${remote}`)
    onSubmit({url: remote})
  }
  
  return (
    <Layout title="Home">
      <main className="flex flex-col p-4 justify-center items-center">
        <h1 className="text-5xl py-16 font-bold tracking-wide">
          Welcome to <Link href="https://gitgratitude.com"><a className="text-blue-600">git gratitude!</a></Link>
        </h1>

        { message.length > 0 && <Spinner text={message} spin={loading}/> }

        <div className="pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="py-4">
            <input 
              type="text" 
              {...register( 'url' )} 
              placeholder="Remote URL"
              className="py-1 px-4 border-2 rounded border-blue-600 w-64"/>
            <button type="submit"
              className="mx-4 py-2 px-4 bg-blue-600 text-white rounded">Look for repo</button>
          </form>
        </div>
      </main>
    </Layout>
  )
}

export const getServerSideProps = handle({
    async post({ req}) {
      console.log( req.body )
      console.log( req.headers )

      const receivedEvent = HTTP.toEvent({headers: req.headers, body: req.body })
      console.log( receivedEvent )
      return json({ message: 'Thanks for your submission!' });
    },
    async get() {
      return json( {message:"ok"} )
    }
},
 
)

export default Home
