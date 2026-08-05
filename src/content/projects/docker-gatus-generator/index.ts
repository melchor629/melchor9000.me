import type { ProjectEntry } from '../types'

const dockerGatusGenerator = Object.freeze({
  title: 'docker-gatus-generator',
  technologies: ['Docker', 'golang'],
  description:
    'Extracts containers from the Docker API and generate gatus config or other kind of files using templates.',
  links: {
    repo: 'https://github.com/melchor629/docker-gatus-generator',
  },
  status: {
    started: '2026-03-28',
    status: 'active',
  },
} satisfies ProjectEntry)

export default dockerGatusGenerator
