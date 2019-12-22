import * as firebase from 'firebase-admin'
import * as functions from 'firebase-functions'
import postsApp from './posts'

firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
  databaseURL: 'https://melchor9000-webpage.firebaseio.com',
  storageBucket: 'gs://melchor9000-webpage.appspot.com',
})

const euFunctions = functions.region('europe-west1')

export const posts = euFunctions
  .runWith({ timeoutSeconds: 15 })
  .https
  .onRequest(postsApp)
