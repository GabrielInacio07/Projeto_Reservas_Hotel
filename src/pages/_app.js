import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import Navbar from '../components/Navbar'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-hotel-beige">
        <Navbar />
        <main className="container mx-auto pt-6">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  )
}