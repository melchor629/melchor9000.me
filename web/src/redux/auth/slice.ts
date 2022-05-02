import type { User } from 'firebase/auth'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from './state'

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggingIn: (state) => {
      state.error = null
      state.loggingIn = true
    },
    logIn: (state, { payload }: PayloadAction<User>) => {
      state.loggingIn = false
      state.user = payload
    },
    logInError: (state, { payload }: PayloadAction<{ code: string, message: string }>) => {
      state.loggingIn = false
      state.error = payload
    },
    logOut: (state) => {
      state.user = null
      state.error = null
    },
    logOutError: (state, { payload }: PayloadAction<{ code: string, message: string }>) => {
      state.error = payload
    },
  },
})

export default authSlice
