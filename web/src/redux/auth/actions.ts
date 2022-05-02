import * as auth from 'firebase/auth'
import type { Dispatch } from 'redux'
import app from '../../lib/firebase'
import authSlice from './slice'

const {
  logIn: leLogIn,
  logInError,
  logOut: leLogOut,
  logOutError,
  loggingIn,
} = authSlice.actions

export const logIn = (user: string, password: string) => async (dispatch: Dispatch) => {
  dispatch(loggingIn())
  try {
    const currentAuth = auth.getAuth(app)
    await auth.signInWithEmailAndPassword(currentAuth, user, password)
    dispatch(leLogIn(currentAuth.currentUser!))
  } catch (e) {
    dispatch(logInError(e as any))
  }
}

export const logOut = () => async (dispatch: Dispatch) => {
  try {
    const currentAuth = auth.getAuth(app)
    await currentAuth.signOut()
    dispatch(leLogOut())
  } catch (error) {
    dispatch(logOutError(error as any))
  }
}
