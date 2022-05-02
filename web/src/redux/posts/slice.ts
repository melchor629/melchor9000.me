import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from './state'

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPostContent: (state) => {
      state.content = null
    },
    setPostContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload
    },
    saveScroll: (state, action: PayloadAction<number>) => {
      state.scroll = action.payload
    },
    showMore: (state, action: PayloadAction<number | undefined>) => {
      if ((action.payload ?? 0) > 0) {
        state.showing = Math.max((state.posts || []).length, state.showing + action.payload!)
      } else {
        state.showing = 3
      }
    },
  },
})

export default postsSlice
