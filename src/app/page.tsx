import type { Metadata } from 'next'
import AboutMe from './about-me'
import Hello from './hello'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  const random = Math.random()

  return (
    <>
      <Hello random={random} />
      <AboutMe random={random} />
    </>
  )
}
