import { RequestHandler } from 'express'
import lastfm from '../utils/logic/lastfm'

const nowPlayingController: RequestHandler = async (req, res) => {
  const user = req.params.user || 'melchor629'
  const { recenttracks: { track } } = await lastfm.user.getRecentTracks(user)
  const mappedTracks = (track as any[]).map((t: any) => ({
    artist: t.artist && t.artist['#text'],
    album: t.album && t.album['#text'],
    title: t.name,
    albumArtImages: t.image?.map((i: any) => ({
      url: i['#text'],
      size: i.size,
    })),
    nowPlaying: t['@attr']?.nowplaying,
    scrobbledAt: t.date && new Date(t.date.uts * 1000),
  }))
  res.json({
    recentTracks: mappedTracks.filter((t) => !t.nowPlaying),
    nowPlaying: mappedTracks.find((t) => t.nowPlaying) || null,
  })
}

export default nowPlayingController
