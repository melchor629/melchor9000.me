import { Link } from '@mui/material'
import type { ProjectEntry } from '../types'
import image from './youtubeAudioWeb.png'

const youtubeAudioWeb = Object.freeze({
  description: (
    <>
      Web app which allows you to listen to Youtube videos. Developed by all members of&nbsp;
      <Link href="https://github.com/MajorcaDevs" target="_blank" rel="noreferrer">
        MajorcaDevs
      </Link>
      &nbsp;and uses&nbsp;
      <Link
        href="https://github.com/melchor629/youtubedl-audio-api"
        target="_blank"
        rel="noreferrer"
      >
        youtubedl-audio-api
      </Link>
      &nbsp;project which offers the backend API for the web app to work.
    </>
  ),
  technologies: ['JavaScript', 'React'],
  title: 'youtubeAudio',
  image,
  imageFit: 'cover',
  links: {
    repo: 'https://github.com/MajorcaDevs/youtubeAudio',
    demo: 'https://youtubeaudio.majorcadevs.com',
  },
  status: {
    started: '2018-03-20',
    finished: '2024-04-25',
    status: 'archived',
  },
} satisfies ProjectEntry)

export default youtubeAudioWeb
