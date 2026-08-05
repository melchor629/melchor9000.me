"use cache"

import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import NowListening from './now-listening'

export const metadata: Metadata = {
  title: 'Now Listening',
  description: 'List of recent tracks that the owner of the site listens to',
}

// oxlint-disable-next-line typescript/require-await
export default async function NowListeningMyself() {
  cacheLife('minutes')
  return <NowListening user="melchor629" />
}
