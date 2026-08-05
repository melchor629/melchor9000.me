const apiUrl = 'https://ws.audioscrobbler.com/2.0/'
const apiKey = process.env.LASTFM_API_KEY

if (!apiKey) {
  throw new Error('Please fill LASTFM_API_KEY')
}

interface RecentTrack {
  artist?: {
    name: string
  }
  album?: {
    ['#text']: string
  }
  name: string
  image?: Array<{
    ['#text']: string
    size: string
  }>
  ['@attr']?: {
    nowplaying?: 'true'
  }
  date?: {
    uts: number
  }
  url: string
  mbid: string
}

export interface RecentTrackItem {
  readonly artist?: string
  readonly album?: string
  readonly title: string
  readonly albumArtImages: ReadonlyArray<{ url: string; size: string }>
  readonly nowPlaying: boolean
  readonly scrobbledAt: Date | null
  readonly mbid: string
}

export const getRecentTracks = async (username: string, count: number = 10) => {
  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: username,
    limit: `${count}`,
    extended: '1',
    api_key: apiKey,
    format: 'json',
  })
  const res = await fetch(`${apiUrl}?${params}`, {
    headers: {
      'user-agent': 'melchor9000.me/functions (https://github.com/melchor629/melchor9000.me)',
    },
    next: {
      revalidate: 30,
      tags: ['lastfm:recent-tracks', `lastfm:recent-tracks:${username}`],
    },
  })
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`LastFM response error: ${res.status}`)
  }

  const {
    recenttracks: { track },
  } = (await res.json()) as { recenttracks: { track: RecentTrack[] } }
  const mappedTracks = track.map((t): RecentTrackItem =>
    Object.freeze({
      artist: t.artist?.name,
      album: t.album?.['#text'],
      title: t.name,
      albumArtImages:
        t.image?.map((i) => ({
          url: i['#text'],
          size: i.size,
        })) ?? [],
      nowPlaying: !!t['@attr']?.nowplaying,
      scrobbledAt: t.date ? new Date(t.date.uts * 1000) : null,
      mbid: t.mbid,
    }),
  )
  return Object.freeze(mappedTracks)
}
