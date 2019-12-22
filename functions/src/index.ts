import * as firebase from 'firebase-admin'
import * as functions from 'firebase-functions'
import postsApp from './posts'

firebase.initializeApp()

const euFunctions = functions.region('europe-west1')

export const posts = euFunctions
  .runWith({ timeoutSeconds: 15 })
  .https
  .onRequest(postsApp)
