import { Stack } from '@mui/material'
import type { Metadata } from 'next'
import { revalidateTag } from 'next/cache'
import { notFound } from 'next/navigation'
import { getRecentTracks } from '@/clients/lastfm'
import Container from '@/components/container'
import PageHeader from '@/components/page-header'
import TrackCard from './track-card'
import Tricks from './tricks'

export const revalidate = 30000

export const metadata: Metadata = {
  title: 'Now Listening',
  description: 'List of recent tracks that the owner of the site listens to',
}

export default async function NowListening({ params }: { readonly params: Promise<{ user?: string }> }) {
  const { user = 'melchor629' } = await params
  const info = await getRecentTracks(user, 25)
  if (info == null) {
    notFound()
  }

  return (
    <Container>
      <PageHeader
        title="Now Listening"
        subtitle={`What is ${user} listening to?`}
      />

      <Stack gap={1.5}>
        {info.map((track) => (
          <TrackCard key={track.nowPlaying ? 'np' : +track.scrobbledAt!} track={track} />
        ))}
      </Stack>

      <Tricks
        refreshAction={async () => {
          'use server'

          revalidateTag(`lastfm:recent-tracks:${user}`)
          return Promise.resolve()
        }}
      />
    </Container>
  )
}
