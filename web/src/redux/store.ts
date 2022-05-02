import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/reducer'
import databaseReducer from './database/reducers'
import effectsReducer from './effects/reducer'
import galleryReducer from './gallery/reducer'
import postsReducer from './posts/reducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
    database: databaseReducer,
    effects: effectsReducer,
    gallery: galleryReducer,
    posts: postsReducer,
  },
})

export default store

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
