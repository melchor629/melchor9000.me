import type { ProjectEntry } from '../types'

const asyncNet = Object.freeze({
  title: 'async-net',
  technologies: ['Java'],
  description:
    'Create TCP or UDP sockets in Java and use them asynchronously by taking advantage of lambda functions. Sockets can be configured with several parameters. Useful for user interfaces. Works on Java 7 or higher and on Android 4.2 or higher.',
  links: {
    repo: 'https://github.com/melchor629/async-net',
  },
  status: {
    started: '2016-09-01',
    finished: '2021-10-10',
    status: 'archived',
  },
} satisfies ProjectEntry)

export default asyncNet
