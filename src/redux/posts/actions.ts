import { Dispatch } from 'redux'
import getFirebaseFunctionUrl from '../../lib/firebase-function'

export const GETTING_POST = 'posts:GETTING_POST'
export const GET_POST = 'posts:GET_POST'
export const SAVE_SCROLL = 'posts:SAVE_SCROLL'
export const SHOW_MORE = 'posts:SHOW_MORE'

const gettingPost = () => ({ type: GETTING_POST })

const postGot = (content: string) => ({
    type: GET_POST,
    content,
})

export const getPost = (post: any) => (dispatch: Dispatch) => {
    dispatch(gettingPost())
    const url = getFirebaseFunctionUrl('posts', `/render/${post._id}`)
    fetch(url)
        .then(response => response.json())
        .then(({ renderedHtml }) => renderedHtml)
        .then(text => dispatch(postGot(text)))
}

export const saveScroll = (scroll: number) => ({
    type: SAVE_SCROLL,
    scroll,
})

export const showMore = (count = 3) => ({
    type: SHOW_MORE,
    count,
})
