import { Link } from '@mui/material'
import type { ProjectEntry } from '../types'
import image from './itunes-scrobbler.png'

const itunesScrobbler = Object.freeze({
  technologies: ['Swift'],
  image,
  title: 'iTunes Scrobbler',
  description: (
    <>
      Simple and straightforward&nbsp;
      <Link href="https://last.fm" target="_blank" rel="noreferrer">
        Last.fm
      </Link>
      &nbsp;scrobbling app for macOS. Scrobbles from iTunes and Music apps, as well as VOX. The app
      is managed entirely from the top-bar of macOS. Requires macOS 10.12 or higher.
    </>
  ),
  links: {
    repo: 'https://github.com/melchor629/iTunes-Scrobbler',
  },
  status: {
    started: '2016-12-20',
    status: 'active',
  },
} satisfies ProjectEntry)

export default itunesScrobbler
