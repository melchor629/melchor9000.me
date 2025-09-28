import type { ProjectEntry } from '../types'
import image from './dadiskactivity.png'

const dadiskactivity = Object.freeze({
  image,
  description: 'Top-bar icon for macOS that shows the read and write speed for a specific hard drive on your system.',
  title: 'DADiskActivity',
  technologies: [
    'Objective-C',
  ],
  status: {
    started: '2013-11-01',
    finished: '2018-08-15',
    status: 'archived',
  },
  links: {
    repo: 'https://github.com/melchor629/DADiskActivity',
  },
} satisfies ProjectEntry)

export default dadiskactivity
