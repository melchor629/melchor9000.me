import { Link } from '@mui/material'
import type { ProjectEntry } from '../types'
import image from './screenshot.jpg'

const playboxWidget = Object.freeze({
  image,
  imageFit: 'cover',
  technologies: ['JavaScript', 'Objective-C', 'Swift'],
  title: 'Playbox.widget',
  description: (
    <>
      Widget for&nbsp;
      <Link
        href="http://tracesof.net/uebersicht/"
        target="_blank"
        rel="noreferrer"
      >
        Übersicht
      </Link>
      &nbsp;which shows the album artwork, the progress and song metadata of the song you are
      listening to right now from players iTunes/Music, Spotify or VOX.
    </>
  ),
  links: {
    repo: 'https://github.com/melchor629/Playbox.widget',
  },
  status: {
    started: '2018-01-01',
    status: 'active',
  },
} satisfies ProjectEntry)

export default playboxWidget
