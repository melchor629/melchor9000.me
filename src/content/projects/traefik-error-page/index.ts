import type { ProjectEntry } from '../types'

const traefikErrorPage = Object.freeze({
  title: 'traefik-error-page',
  technologies: [
    'golang',
  ],
  description: 'Custom middleware for Traefik that expands the oficial error middleware, with a twist.',
  links: {
    repo: 'https://github.com/melchor629/traefik-error-page',
  },
  status: {
    started: '2023-12-01',
    status: 'active',
  },
} satisfies ProjectEntry)

export default traefikErrorPage
