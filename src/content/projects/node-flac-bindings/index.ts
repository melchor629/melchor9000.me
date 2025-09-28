import type { ProjectEntry } from '../types'

const nodeFlacBindings = Object.freeze({
  description: 'Call to libflac APIs from node.js, with easy to use stream API encoder and decoders.',
  technologies: [
    'node.js',
    'JavaScript',
    'C++',
  ],
  title: 'node-flac-bindings',
  links: {
    repo: 'https://github.com/melchor629/node-flac-bindings',
    web: 'https://www.npmjs.com/package/flac-bindings',
  },
  status: {
    started: '2016-06-10',
    status: 'active',
  },
} satisfies ProjectEntry)

export default nodeFlacBindings
