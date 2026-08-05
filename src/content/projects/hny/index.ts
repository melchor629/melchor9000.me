import type { ProjectEntry } from '../types'
import image from './hny.png'

const hny = Object.freeze({
  image,
  imageFit: 'cover',
  title: 'HNY/FAN',
  technologies: ['GLSL', 'JavaScript', 'React', 'three.js', 'TypeScript'],
  description: 'Happy new year! Todas mis felicitaciones de año nuevo en una sola web.',
  links: {
    repo: 'https://github.com/melchor629/hny',
    web: 'https://fan.melchor9000.me',
  },
  status: {
    started: '2017-12-27',
    status: 'active',
  },
} satisfies ProjectEntry)

export default hny
