import { DateTime } from 'luxon'
import firebaseFunction from './firebase-function'

interface Track {
  album?: string
  albumArtImages?: Array<{
    url: string
    size: 'small' | 'medium' | 'large' | 'extralarge'
  }>
  artist?: string
  title: string
  mbid: string
}

export interface RecentTrack extends Track {
  scrobbledAt: DateTime
}

export interface NowPlayingTrack extends Track {
  nowPlaying: true | 'true'
}

export interface RecentTracksResponse {
  recentTracks: RecentTrack[]
  nowPlaying: NowPlayingTrack | null
}

export const getRecentTrackListForUser = async (user?: string): Promise<RecentTracksResponse> => {
  const res = await fetch(firebaseFunction.nowPlaying(user ? `/${user}` : ''))
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${body}`)
  }

  const data: RecentTracksResponse = await res.json()
  return {
    ...data,
    recentTracks: data.recentTracks.map((rt) => ({
      ...rt,
      scrobbledAt: DateTime.fromISO(rt.scrobbledAt as unknown as string),
    })),
  }
}

export const getRecentTrackList = () => getRecentTrackListForUser()
