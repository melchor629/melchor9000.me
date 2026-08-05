import { Stack } from '@mui/material'
import { updateTag } from 'next/cache'
import { notFound } from 'next/navigation'
import { getRecentTracks } from '@/clients/lastfm'
import Container from '@/components/container'
import PageHeader from '@/components/page-header'
import TrackCard from './track-card'
import Tricks from './tricks'

export default async function NowListening({ user }: { readonly user: string }) {
  const info = await getRecentTracks(user, 25)
  if (info == null) {
    notFound()
  }

  return (
    <Container>
      <PageHeader title="Now Listening" subtitle={`What is ${user} listening to?`} />
      <Stack sx={{ gap: 1.5 }}>
        {info.map((track) => (
          <TrackCard key={track.nowPlaying ? 'np' : +track.scrobbledAt!} track={track} />
        ))}
      </Stack>
      <Tricks
        refreshAction={async () => {
          'use server'

          updateTag(`lastfm:recent-tracks:${user}`)
          return Promise.resolve()
        }}
      />
    </Container>
  )
}
