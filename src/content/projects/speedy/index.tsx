import type { ProjectEntry } from '../types'

const speedy = Object.freeze({
  description: (
    <>
      Utility for gateways/routers to collect network speed stats and save them in a&nbsp;
      <i>time series</i>
      &nbsp;database.
    </>
  ),
  title: 'speedy',
  technologies: [
    'golang',
    'Docker',
  ],
  links: {
    repo: 'https://github.com/melchor629/speedy',
  },
  status: {
    started: '2018-05-18',
    status: 'active',
  },
} satisfies ProjectEntry)

export default speedy
