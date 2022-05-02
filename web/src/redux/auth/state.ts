import { getAuth, User } from 'firebase/auth'
import app from '../../lib/firebase'

export interface AuthState {
  user: User | null
  loggingIn: boolean
  error: { code: string, message: string } | null
}

export const initialState = (): AuthState => ({
  user: getAuth(app).currentUser,
  loggingIn: false,
  error: null,
})
