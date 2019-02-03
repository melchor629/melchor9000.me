import { combineReducers } from 'redux';
import { effects, EffectsState } from './effects/reducers';
import { database, DatabaseState } from './database/reducers';
import { galleryList, GalleryState } from './gallery/reducers';
import { posts, PostsState } from './posts/reducers';
import { auth, AuthState } from './auth/reducers';

export const reducers = combineReducers({
    effects,
    database,
    galleryList,
    posts,
    auth
});

export interface State {
    effects: EffectsState;
    database: DatabaseState;
    galleryList: GalleryState;
    posts: PostsState;
    auth: AuthState;
}
