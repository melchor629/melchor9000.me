import type { ProjectEntry } from '../types'

const dvd = Object.freeze({
  title: 'dvd',
  technologies: [
    'Python',
    'ffmpeg',
  ],
  description: 'A small utility that generates a stream of images simulating the good ol\' DVD screensavers. Images are sent to ffmpeg and the encoded using the provided arguments.',
  links: {
    repo: 'https://github.com/MajorcaDevs/dvd',
  },
  status: {
    started: '2021-07-15',
    status: 'active',
  },
} satisfies ProjectEntry)

export default dvd
