import { AnyAction } from 'redux'
import { Timestamp } from 'firebase/firestore'
import {
  GET_POST,
  GETTING_POST,
  SAVE_SCROLL,
  SHOW_MORE,
} from './actions'

export interface PostsState {
  scroll: number
  posts: Post[] | null
  showing: number
  content: null | string
}

export interface Post {
  _id?: string
  date: Timestamp
  // That is the file where we can find the content of the page
  file: string
  img: string
  title: string
  // That is the part that will be shown in the URL (human friendly)
  url: string
  modifiedDate?: Timestamp
  hide?: boolean
}

// eslint-disable-next-line @typescript-eslint/default-param-last
export const posts = (state: PostsState = {
  scroll: 0,
  posts: null,
  showing: 6,
  content: null,
}, action: AnyAction) => {
  switch (action.type) {
    case GETTING_POST:
      return { ...state, content: null }

    case GET_POST:
      return { ...state, content: action.content }

    case SAVE_SCROLL:
      return { ...state, scroll: action.scroll }

    case SHOW_MORE:
      if (action.count > 0) {
        return {
          ...state,
          showing: Math.max((state.posts || []).length, state.showing + action.count),
        }
      }
      return { ...state, showing: 3 }

    default: return state
  }
}
