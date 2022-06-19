import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Layout } from '../components'
import '../styles/globals.css'
import { StateContext } from '../context/StateContext'

function MyApp({ Component, pageProps }) {
  return (
    // bale pinapasa lang natin lahat ng data sa state sa lahat ng component natin
    <StateContext>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>
    )
}

export default MyApp
