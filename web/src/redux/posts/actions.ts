import { Dispatch } from 'redux'
import postsSlice from './slice'
import { Post } from './state'
import getFirebaseFunctionUrl from '../../lib/firebase-function'
import { ID } from '../database/state'

export const { saveScroll, showMore } = postsSlice.actions
const { clearPostContent, setPostContent } = postsSlice.actions

export const getPost = (post: Post) => (dispatch: Dispatch) => {
  dispatch(clearPostContent())
  const url = getFirebaseFunctionUrl('posts', `/render/${post[ID]}`)
  fetch(url)
    .then((response) => response.json())
    .then(({ renderedHtml }) => renderedHtml)
    .then((text) => dispatch(setPostContent(text)))
}
