import type { ProjectEntry } from '../types'

const dockerDnscryptProxy = Object.freeze({
  title: 'docker-dnscrypt-proxy',
  technologies: ['Docker'],
  description:
    'Docker images for the dnscrypt-proxy project with a set of tools to get started easily.',
  links: {
    repo: 'https://github.com/melchor629/docker-dnscrypt-proxy',
  },
  status: {
    started: '2018-10-01',
    status: 'active',
  },
} satisfies ProjectEntry)

export default dockerDnscryptProxy
