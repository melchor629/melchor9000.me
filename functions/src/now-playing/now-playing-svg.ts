import { RequestHandler } from 'express'
import { promisify } from 'util'
import lastfm from '../utils/logic/lastfm'

const nowPlayingSvgController: RequestHandler = async (req, res) => {
  const user = req.params.user || 'melchor629'
  const { recenttracks: { track } } = await lastfm.user.getRecentTracks(user, 15)

  const nowPlayingTrack = (track as any[]).find((t) => t['@attr']?.nowplaying)
  const params: any = {}
  if (nowPlayingTrack) {
    params.status = 'Vibing to:'
    params.imageUrl = nowPlayingTrack.image && nowPlayingTrack.image.slice(-1)[0]['#text']
    params.artistName = nowPlayingTrack.artist?.name
    params.songName = nowPlayingTrack.name
    params.songUrl = nowPlayingTrack.url
  } else {
    const randomIndex = Math.trunc(track.length * Math.random())
    const randomTrack = track[randomIndex]
    params.status = `Was playing at ${new Date(randomTrack.date.uts * 1000).toLocaleString('es-ES')}:`
    params.imageUrl = randomTrack.image && randomTrack.image.slice(-1)[0]['#text']
    params.artistName = randomTrack.artist?.name
    params.songName = randomTrack.name
    params.songUrl = randomTrack.url
  }

  res.type('image/svg+xml').send(
    await promisify<string, object>(res.render.bind(res))('now-playing.ejs', params),
  )
}

export default nowPlayingSvgController
