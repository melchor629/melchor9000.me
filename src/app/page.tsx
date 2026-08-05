import type { Metadata } from 'next'
import { connection } from 'next/server'
import { Suspense } from 'react'
import AboutMe from './about-me'
import Hello from './hello'

export const metadata: Metadata = {
  title: 'Home',
}

async function Home() {
  await connection()
  // eslint-disable-next-line react-hooks/purity
  const random = Math.random()

  return (
    <>
      <Hello random={random} />
      <AboutMe random={random} />
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<Hello />}>
      <Home />
    </Suspense>
  )
}
