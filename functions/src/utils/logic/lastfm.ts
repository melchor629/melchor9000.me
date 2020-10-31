import * as functions from 'firebase-functions'
import got from 'got'

const apiUrl = 'https://ws.audioscrobbler.com/2.0/'

const getRecentTracks = async (username: string, count: number = 10) => {
  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: username,
    limit: `${count}`,
    extended: '1',
    api_key: functions.config().lastfm.api_key,
    format: 'json',
  })
  const res = await got<any>(`${apiUrl}?${params}`, {
    responseType: 'json',
    headers: {
      'user-agent': 'melchor9000.me/functions (https://github.com/melchor629/melchor9000.me)',
    },
  })
  return res.body
}

export default {
  user: {
    getRecentTracks,
  },
}
