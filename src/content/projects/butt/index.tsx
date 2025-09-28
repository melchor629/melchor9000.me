import { Link } from '@mui/material'
import type { ProjectEntry } from '../types'
import image from './butt.png'

const butt = Object.freeze({
  description: (
    <>
      Multiplatform tool for radio streaming to the internet. Sends to Icecast and Shoutcast
      servers, using MP3, Vorbis, Opus or AAC. Also has option for recording the stream. Has support
      for multiple languages. It is a&nbsp;
      <Link href="http://danielnoethen.de" target="_blank" rel="noreferrer">fork</Link>
      . Currently, part of these changes are back into the original code.
    </>
  ),
  technologies: [
    'C++',
    'FLTK',
  ],
  image,
  title: 'butt (Broadcast Using This Tool)',
  links: {
    repo: 'https://github.com/melchor629/butt',
  },
  status: {
    started: '2015-06-01',
    finished: '2017-05-01',
    status: 'discontinued',
  },
} satisfies ProjectEntry)

export default butt
