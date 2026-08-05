import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'
import NowListening from '../now-listening'

export const instant = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ user: string }>
}): Promise<Metadata> {
  const { user } = await params
  return {
    title: 'Now Listening',
    description: `List of recent tracks that ${user} listens to`,
  }
}

export default async function NowListeningOther({
  params,
}: PageProps<'/experiments/now-listening/[user]'>) {
  'use cache'
  cacheLife('minutes')
  const { user } = await params
  return <NowListening user={user} />
}
