import { connect } from 'react-redux';
import PostListComponent from '../../components/posts/post-list';
import { Post } from '../../redux/posts/reducers';
import { State } from '../../redux/reducers';
import { changeTitle } from '../../redux/title/actions';
import { saveScroll, showMore } from '../../redux/posts/actions';

export interface PostListStateToPros {
    scroll: number;
    posts: Post[] | null;
    postsCount: number;
}

export interface PostListDispatchToProps {
    changeTitle: (title: string) => void;
    saveScroll: (scroll: number) => void;
    showMore: (count?: number) => void;
}

const mapStateToProps = ({ database, posts }: State): PostListStateToPros => ({
    scroll: posts.scroll,
    posts: database.snapshots.posts ?
        database.snapshots.posts
            .slice(0, posts.showing) :
        null,
    postsCount: database.snapshots.posts ? database.snapshots.posts.length : 0,
});

const mapDispatchToProps = (dispatch: any): PostListDispatchToProps => ({
    changeTitle: (title: string) => dispatch(changeTitle(title)),
    saveScroll: (scroll: number) => dispatch(saveScroll(scroll)),
    showMore: (count?: number) => dispatch(showMore(count)),
});

export const PostList = connect(mapStateToProps, mapDispatchToProps)(PostListComponent);
