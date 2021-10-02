import * as auth from 'firebase/auth'
import app from '../../lib/firebase'

export const LOGGING_IN = 'auth:LOGGING_IN'
export const LOG_IN = 'auth:LOG_IN'
export const LOG_IN_ERROR = 'auth:LOG_INT_ERROR'
export const LOG_OUT = 'auth:LOG_OUT'
export const LOG_OUT_ERROR = 'auth:LOG_OUT_ERROR'

export const logIn = (user, password) => async (dispatch) => {
  dispatch({ type: LOGGING_IN })
  try {
    const currentAuth = auth.getAuth(app)
    await auth.signInWithEmailAndPassword(currentAuth, user, password)
    dispatch({ type: LOG_IN, user: currentAuth.currentUser })
  } catch (e) {
    dispatch({ type: LOG_IN_ERROR, code: e.code, message: e.message })
  }
}

export const logOut = () => async (dispatch) => {
  try {
    const currentAuth = auth.getAuth(app)
    await currentAuth.signOut()
    dispatch({ type: LOG_OUT })
  } catch (error) {
    dispatch({ type: LOG_OUT_ERROR, error })
  }
}
