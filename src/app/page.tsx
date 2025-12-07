import type { Metadata } from 'next'
import AboutMe from './about-me'
import Hello from './hello'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  // eslint-disable-next-line react-hooks/purity
  const random = Math.random()

  return (
    <>
      <Hello random={random} />
      <AboutMe random={random} />
    </>
  )
}
