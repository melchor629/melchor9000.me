import { connect } from 'react-redux';
import { Post } from '../../redux/posts/reducers';
import { State } from '../../redux/reducers';
import { getPost } from '../../redux/posts/actions';
import { changeTitle } from '../../redux/title/actions';
import PostPageComponent from '../../components/posts/post-page';

export interface PostPageStateToProps {
    content: string | null;
    posts: Post[] | null;
}

export interface PostPageDispatchToProps {
    loadPost: (post: Post) => void;
    changeTitle: (title: string) => void;
}

const mapStateToProps = ({ database, posts }: State): PostPageStateToProps => ({
    content: posts.content,
    posts: database.snapshots.posts,
});

const mapDispatchToProps = (dispatch: any): PostPageDispatchToProps => ({
    loadPost: (post: Post) => dispatch(getPost(post)),
    changeTitle: (title: string) => dispatch(changeTitle(title)),
});

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(PostPageComponent);
