import { User } from '@firebase/auth-types';
import { connect } from 'react-redux';
import { State } from 'src/redux/reducers';
import { changeTitle } from 'src/redux/title/actions';
import { subscribe, unsubscribe } from 'src/redux/database/actions';
import PostsComponent from 'src/components/admin/posts';
import { Post } from 'src/redux/posts/reducers';

export interface PostsStateToProps {
    user: User;
    posts: Post[] | null | undefined;
}

export interface PostsDispatchToProps {
    changeTitle: (title: string) => void;
    subscribe: () => void;
    unsubscribe: () => void;
}

const mapStateToProps = (state: State): PostsStateToProps => ({
    user: state.auth.user!,
    posts: state.database.snapshots.posts,
});

const mapDispatchToProps = (dispatch: any): PostsDispatchToProps => ({
    changeTitle: (title: string) => dispatch(changeTitle(title)),
    subscribe: () => dispatch(subscribe('posts', '-date')),
    unsubscribe: () => dispatch(unsubscribe('posts')),
});

export const Posts = connect(mapStateToProps, mapDispatchToProps)(PostsComponent);
export const Component = Posts;
