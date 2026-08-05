import type { ProjectEntry } from '../types'
import image from './widget.png'

const lastFmWebWidget = Object.freeze({
  description: 'Simple widget which shows your recent scrobblings. Customizable theme.',
  technologies: ['JavaScript', 'jQuery'],
  title: 'LastFM Web Widget',
  image,
  links: {
    repo: 'https://github.com/melchor629/Last.fm-Web-Widget',
    demo: 'http://melchor629.github.io/Last.fm-Web-Widget/',
  },
  status: {
    started: '2014-04-01',
    finished: '2016-01-01',
    status: 'archived',
  },
} satisfies ProjectEntry)

export default lastFmWebWidget
