import * as firebase from 'firebase-admin'
import * as functions from 'firebase-functions'
import postsApp from './posts'
import nowPlayingApp from './now-playing'
import galleryApp from './gallery'

firebase.initializeApp()

const euFunctions = functions.region('europe-west1')

export const posts = euFunctions
  .runWith({ timeoutSeconds: 15, memory: '256MB' })
  .https
  .onRequest(postsApp)

export const nowPlaying = euFunctions
  .runWith({ timeoutSeconds: 10, memory: '128MB' })
  .https
  .onRequest(nowPlayingApp)

export const gallery = euFunctions
  .runWith({ timeoutSeconds: 10, memory: '128MB' })
  .https
  .onRequest(galleryApp)
