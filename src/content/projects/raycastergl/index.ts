import type { ProjectEntry } from '../types'
import image from './raycastergl.png'

const raycastergl = Object.freeze({
  description: 'Wolfenstein 3D-like raycaster but using the GPU (compute shaders).',
  links: {
    repo: 'https://github.com/melchor629/raycastergl',
  },
  status: {
    status: 'active',
    started: '2020-05-01',
  },
  technologies: ['C++', 'OpenGL', 'GLSL'],
  title: 'raycastergl',
  image,
  imageFit: 'cover',
} satisfies ProjectEntry)

export default raycastergl
