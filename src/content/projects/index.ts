import asyncNet from './async-net'
import brainfuckInRust from './brainfuck-in-rust'
import butt from './butt'
import chromecasterGui from './chromecaster-gui'
import dadiskactivity from './dadiskactivity'
import dockerDnscryptProxy from './docker-dnscrypt-proxy'
import dvd from './dvd'
import hny from './hny'
import itunesScrobbler from './itunes-scrobbler'
import lastFmWebWidget from './last.fm-web-widget'
import lolItemSetsMac from './lol-item-sets-mac'
import nas from './nas'
import nodeFlacBindings from './node-flac-bindings'
import playboxWidget from './playbox.widget'
import raycastergl from './raycastergl'
import raytracer from './raytracer'
import retro from './retro'
import speedy from './speedy'
import traefikAuth from './traefik-auth'
import traefikErrorPage from './traefik-error-page'
import type { Projects } from './types'
import watchTime from './watch-time'
import wikimusic from './wikimusic'
import youtubeAudioApi from './youtube-audio-api'
import youtubeAudioWeb from './youtube-audio-web'

const projects: Projects = Object.freeze({
  asyncNet,
  brainfuckInRust,
  butt,
  chromecasterGui,
  dadiskactivity,
  dockerDnscryptProxy,
  dvd,
  hny,
  itunesScrobbler,
  lastFmWebWidget,
  lolItemSetsMac,
  nas,
  nodeFlacBindings,
  playboxWidget,
  raycastergl,
  raytracer,
  retro,
  speedy,
  traefikAuth,
  traefikErrorPage,
  watchTime,
  wikimusic,
  youtubeAudioApi,
  youtubeAudioWeb,
})

export default projects
