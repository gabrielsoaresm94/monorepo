import React from "react";
import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps): any { // TODO
  return <Component {...pageProps} />
}
export default MyApp
