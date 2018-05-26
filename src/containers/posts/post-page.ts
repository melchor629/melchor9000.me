import { connect } from 'react-redux';
import { Post } from 'src/redux/posts/reducers';
import { State } from 'src/redux/reducers';
import { getPost } from 'src/redux/posts/actions';
import { changeTitle } from 'src/redux/title/actions';
import PostPageComponent from 'src/components/posts/post-page';

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
