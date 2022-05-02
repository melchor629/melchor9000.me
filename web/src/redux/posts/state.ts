import { Timestamp } from 'firebase/firestore'
import type { ID } from '../database/state'

export interface Post {
  [ID]: string
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

export interface PostsState {
  scroll: number
  posts: Post[] | null
  showing: number
  content: null | string
}

export const initialState: PostsState = {
  scroll: 0,
  posts: null,
  showing: 6,
  content: null,
}
