import type { ProjectEntry } from '../types'

const nas = Object.freeze({
  title: 'NAS',
  technologies: ['JavaScript', 'node.js', 'React', 'TypeScript'],
  description:
    'A set of services (persistence, auth and fs) and a website to access files from my own NAS on the internet. Project currently is private.',
  links: {
    repo: 'https://git.majorcadevs.com/melchor9000',
  },
  status: {
    started: '2019-03-01',
    status: 'active',
  },
} satisfies ProjectEntry)

export default nas
