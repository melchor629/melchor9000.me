import firebase from 'firebase-admin'
import functions from 'firebase-functions'
import postsApp from './posts/index.js'
import nowPlayingApp from './now-playing/index.js'
import galleryApp from './gallery/index.js'

firebase.initializeApp()

const euFunctions = functions.region('europe-west1')

export const posts = euFunctions
  .runWith({ timeoutSeconds: 15, memory: '256MB' })
  .https
  .onRequest(postsApp)

export const nowPlaying = euFunctions
  .runWith({ timeoutSeconds: 10, memory: '256MB' })
  .https
  .onRequest(nowPlayingApp)

export const gallery = euFunctions
  .runWith({ timeoutSeconds: 10, memory: '256MB' })
  .https
  .onRequest(galleryApp)
