import type { ProjectEntry } from '../types'

const youtubeAudioApi = Object.freeze({
  description: 'Small API around yt-dlp.',
  technologies: ['Python', 'Flask'],
  title: 'youtube-audio-api',
  links: {
    repo: 'https://github.com/melchor629/youtubedl-audio-api',
  },
  status: {
    started: '2018-03-15',
    status: 'active',
  },
} satisfies ProjectEntry)

export default youtubeAudioApi
