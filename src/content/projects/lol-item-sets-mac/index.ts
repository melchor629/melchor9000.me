import type { ProjectEntry } from '../types'
import image from './preview.png'

const lolItemSetsMac = Object.freeze({
  description: 'Adds custom item sets generated automatically based on winrate for the current patch. This version is only for macOS, there were another for Windows.',
  title: 'LoL Item Sets (macOS)',
  image,
  technologies: [
    'Swift',
  ],
  links: {
    repo: 'https://github.com/league-of-legends-devs/LoL-item-sets-Mac',
    web: 'https://lol-item-sets-generator.org',
  },
  status: {
    started: '2016-06-01',
    finished: '2019-12-10',
    status: 'archived',
  },
} satisfies ProjectEntry)

export default lolItemSetsMac
