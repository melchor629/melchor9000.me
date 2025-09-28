import type { ProjectEntry } from '../types'
import image from './asdf.png'

const raytracer = Object.freeze({
  title: 'raytracer',
  technologies: [
    'rust',
  ],
  description: 'Simple CPU raytracer written in rust.',
  image,
  imageFit: 'cover',
  links: {
    web: 'https://raytracing.github.io/books/RayTracingInOneWeekend.html',
  },
  status: {
    started: '2022-02-03',
    status: 'active',
  },
} satisfies ProjectEntry)

export default raytracer
