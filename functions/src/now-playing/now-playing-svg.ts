import { RequestHandler } from 'express'
import { promisify } from 'util'
import lastfm from '../utils/logic/lastfm'

const nowPlayingSvgController: RequestHandler = async (req, res) => {
  const user = req.params.user || 'melchor629'
  const { recenttracks: { track } } = await res.measure(
    lastfm.user.getRecentTracks(user, 15),
    'lastfm.user.getRecentTracks',
  )

  const nowPlayingTrack = track.find((t) => t['@attr']?.nowplaying)
  const params: any = {}
  if (nowPlayingTrack) {
    params.status = 'Vibing to:'
    params.imageUrl = nowPlayingTrack.image?.at(-1)?.['#text']
    params.artistName = nowPlayingTrack.artist?.name
    params.songName = nowPlayingTrack.name
    params.songUrl = nowPlayingTrack.url
  } else {
    const randomIndex = Math.trunc(track.length * Math.random())
    const randomTrack = track[randomIndex]
    params.status = `Was playing at ${new Date(randomTrack.date.uts * 1000).toLocaleString('es-ES')}:`
    params.imageUrl = randomTrack.image?.at(-1)?.['#text']
    params.artistName = randomTrack.artist?.name
    params.songName = randomTrack.name
    params.songUrl = randomTrack.url
  }

  res.header('Cache-Control', 'no-cache')
  res.type('image/svg+xml').send(
    await res.measure(
      promisify<string, any, string>(res.render.bind(res))('now-playing.ejs', params),
      'render',
    ),
  )
}

export default nowPlayingSvgController
