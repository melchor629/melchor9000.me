import { Dispatch } from 'redux';
import * as firebase from 'firebase/app';
import { State } from '../reducers';
import render from '../../lib/render-post-content';

export const GETTING_POST = 'posts:GETTING_POST';
export const GET_POST = 'posts:GET_POST';
export const SAVE_SCROLL = 'posts:SAVE_SCROLL';
export const SHOW_MORE = 'posts:SHOW_MORE';

const gettingPost = () => ({
    type: GETTING_POST
});

const postGot = (content: string) => ({
    type: GET_POST,
    content
});

const parseContent = (text: string, file: string) => render(text, file.endsWith('.md') ? 'md' : 'html');

export const getPost = (post: any) => (dispatch: Dispatch<State>) => {
    dispatch(gettingPost());
    const storage = firebase.storage();
    storage.ref(post.file).getDownloadURL()
        .then(url => fetch(url))
        .then(response => response.text())
        .then(text => parseContent(text, post.file))
        .then(text => dispatch(postGot(text)));
};

export const saveScroll = (scroll: number) => ({
    type: SAVE_SCROLL,
    scroll
});

export const showMore = (count = 3) => ({
    type: SHOW_MORE,
    count
});
