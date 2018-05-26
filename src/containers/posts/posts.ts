import { connect } from 'react-redux';
import PostComponent from 'src/components/posts/posts';
import { State } from 'src/redux/reducers';
import { subscribe, unsubscribe } from 'src/redux/database/actions';
import { PostsDispatchToProps, PostsStateToProps } from './posts.interfaces';

const mapStateToProps = (state: State): PostsStateToProps => ({

});

const mapDispatchToProps = (dispatch: any): PostsDispatchToProps => ({
    subscribePosts: () => dispatch(subscribe('posts', '-date', '<=', new Date())),
    unsuscribePosts: () => dispatch(unsubscribe('posts')),
});

export const Posts = connect(mapStateToProps, mapDispatchToProps)(PostComponent);
