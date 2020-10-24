const region = 'europe-west1'

const firebaseFunction = (funcName: string, path: string = '') => {
    if(process.env.NODE_ENV === 'production') {
        return `https://${region}-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/${funcName}${path}`
    } else {
        return `http://${window.location.hostname}:5000/${process.env.REACT_APP_FIREBASE_PROJECT_ID}/${region}/${funcName}${path}`
    }
}

export default firebaseFunction
