import firebase from 'firebase/app'

export const LOGGING_IN = 'auth:LOGGING_IN'
export const LOG_IN = 'auth:LOG_IN'
export const LOG_IN_ERROR = 'auth:LOG_INT_ERROR'
export const LOG_OUT = 'auth:LOG_OUT'
export const LOG_OUT_ERROR = 'auth:LOG_OUT_ERROR'

export const logIn = (user, password) => async dispatch => {
    dispatch({ type: LOGGING_IN })
    try {
        const auth = firebase.auth()
        await auth.signInWithEmailAndPassword(user, password)
        dispatch({ type: LOG_IN, user: auth.currentUser })
    } catch(e) {
        dispatch({ type: LOG_IN_ERROR, code: e.code, message: e.message })
    }
}

export const logOut = () => async dispatch => {
    try {
        await firebase.auth().signOut()
        dispatch({ type: LOG_OUT })
    } catch(error) {
        dispatch({ type: LOG_OUT_ERROR, error })
    }
}
