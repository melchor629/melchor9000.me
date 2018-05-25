import { connect } from 'react-redux';
import { State } from '../../../redux/reducers';
import { changeTitle } from '../../../redux/title/actions';
import { insert, removeError, update } from '../../../redux/database/actions';
import PostEditorComponent from '../../../components/admin/posts/editor';
import { Post } from '../../../redux/posts/reducers';

export interface PostEditorStateToProps {
    saving: boolean;
    errorSaving: any | null;
}

export interface PostEditorDispatchToProps {
    save: (post: Post) => void;
    update: (post: Post) => void;
    changeTitle: (title: string) => void;
    clearError: () => void;
}

const mapStateToProps = (state: State): PostEditorStateToProps => ({
    saving: state.database.doing.posts,
    errorSaving: state.database.errors.posts,
});

const mapDispatchToProps = (dispatch: any): PostEditorDispatchToProps => ({
    save: (post: Post) => dispatch(insert('posts', post)),
    update: (post: Post) => dispatch(update('posts', post, true)),
    changeTitle: (title: string) => dispatch(changeTitle(title)),
    clearError: () => dispatch(removeError('posts')),
});

export const PostEditor = connect(mapStateToProps, mapDispatchToProps)(PostEditorComponent);
