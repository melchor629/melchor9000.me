import type { ProjectEntry } from '../types'
import image from './chromecaster-gui.png'

const chromecasterGui = Object.freeze({
  image,
  description: 'Simple app to stream your computer\'s audio into a Chromecast. Audio formats supported are MP3 or FLAC. Works on Windows, Linux and macOS.',
  title: 'Chromecaster GUI',
  technologies: [
    'angular.js',
    'C++',
    'Electron',
    'JavaScript',
  ],
  status: {
    started: '2016-03-01',
    finished: '2019-01-01',
    status: 'archived',
  },
  links: {
    repo: 'https://github.com/melchor629/chromecaster-gui',
    web: 'https://melchor629.github.io/chromecaster-gui',
  },
} satisfies ProjectEntry)

export default chromecasterGui
