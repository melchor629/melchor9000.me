import type { ProjectEntry } from '../types'
import image from './sadtime.gif'

const watchTime = Object.freeze({
  technologies: [
    'C++',
    'GTK+ 3',
    'Objective-C',
  ],
  image,
  imageFit: 'cover',
  description: 'Muestra la hora, pero de forma minimalista. Para macOS (10.6 o superior) y Linux (GTK+ 3).',
  title: 'watch-time',
  links: {
    repo: 'https://github.com/melchor629/watch-time',
  },
  status: {
    started: '2017-09-10',
    finished: '2017-09-30',
    status: 'discontinued',
  },
} satisfies ProjectEntry)

export default watchTime
