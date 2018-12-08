import { connect } from 'react-redux';
import { State } from '../../../redux/reducers';
import { changeTitle } from '../../../redux/title/actions';
import { remove, removeError } from '../../../redux/database/actions';
import PostsHomeComponent from '../../../components/admin/posts/home';
import { Post } from '../../../redux/posts/reducers';

export interface PostsHomeStateToProps {
    posts: Post[] | null | undefined;
    deleting: boolean;
    errorSaving: any | null;
}

export interface PostsHomeDispatchToProps {
    changeTitle: (title: string) => void;
    delete: (post: Post) => void;
    clearError: () => void;
}

const mapStateToProps = (state: State): PostsHomeStateToProps => ({
    posts: state.database.snapshots.posts,
    deleting: state.database.doing.posts,
    errorSaving: state.database.errors.posts,
});

const mapDispatchToProps = (dispatch: any): PostsHomeDispatchToProps => ({
    changeTitle: (title: string) => dispatch(changeTitle(title)),
    delete: (post: Post) => dispatch(remove('posts', post)),
    clearError: () => dispatch(removeError('posts'))
});

export const PostsHome = connect(mapStateToProps, mapDispatchToProps)(PostsHomeComponent);
