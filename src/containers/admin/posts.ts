import { User } from '@firebase/auth-types';
import { connect } from 'react-redux';
import { State } from '../../redux/reducers';
import { changeTitle } from '../../redux/title/actions';
import { subscribe, unsubscribe } from '../../redux/database/actions';
import PostsComponent from '../../components/admin/posts';
import { Post } from '../../redux/posts/reducers';

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
