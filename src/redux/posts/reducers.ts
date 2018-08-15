import { AnyAction } from 'redux';
import { GET_POST, SAVE_SCROLL, SHOW_MORE, GETTING_POST } from './actions';
import { Timestamp } from '@firebase/firestore-types';

export interface PostsState {
    scroll: number;
    posts: Post[] | null;
    showing: number;
    content: null | string;
}

export interface Post {
    _id?: string;
    date: Timestamp;
    file: string; //That is the file where we can find the content of the page
    img: string;
    title: string;
    url: string; //That is the part that will be shown in the URL (human friendly)
    modifiedDate?: Timestamp;
}

export const posts = (state: PostsState = { scroll: 0, posts: null, showing: 6, content: null }, action: AnyAction) => {
    switch(action.type) {
        case GETTING_POST:
            return { ...state, content: null };

        case GET_POST:
            return { ...state, content: action.content };

        case SAVE_SCROLL:
            return { ...state, scroll: action.scroll };

        case SHOW_MORE:
            if(action.count > 0) {
                return { ...state, showing: Math.max((state.posts || []).length, state.showing + action.count) };
            } else {
                return { ...state, showing: 3 };
            }

        default: return state;
    }
};
