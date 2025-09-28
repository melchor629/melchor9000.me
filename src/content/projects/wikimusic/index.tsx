import { Link } from '@mui/material'
import type { ProjectEntry } from '../types'
import image from './wikimusic.png'

const wikimusic = Object.freeze({
  title: 'WikiMusic',
  image,
  description: (
    <>
      University project which consists in an Android app that searches information about artists,
      albums or song using&nbsp;
      <Link href="https://lasfm.com" target="_blank" rel="noreferrer">Last.FM</Link>
      &nbsp;API. Requieres Android 4.4 o higher.
    </>
  ),
  technologies: [
    'Java',
    'Android',
  ],
  links: {
    repo: 'https://github.com/melchor629/wikimusic',
    demo: 'https://github.com/melchor629/wikimusic/releases/download/v1.0.3/WikiMusic.apk',
  },
  status: {
    started: '2016-12-16',
    finished: '2017-01-20',
    status: 'archived',
  },
} satisfies ProjectEntry)

export default wikimusic
