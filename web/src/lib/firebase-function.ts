const region = 'europe-west1'

const firebaseFunction = (funcName: string, path: string = '') => {
  if (import.meta.env.PROD) {
    return `https://${region}-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/${funcName}${path}`
  }
  return `http://${window.location.hostname}:8081/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/${region}/${funcName}${path}`
}

firebaseFunction.gallery = (path: string = '') => firebaseFunction('gallery', path)
firebaseFunction.posts = (path: string = '') => firebaseFunction('posts', path)
firebaseFunction.nowPlaying = (path: string = '') => firebaseFunction('nowPlaying', path)

export default firebaseFunction
