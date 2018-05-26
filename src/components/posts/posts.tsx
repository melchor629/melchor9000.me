import * as React from 'react';
import { Route } from 'react-router';
import { RouteComponentProps } from 'react-router';
import { PostsDispatchToProps, PostsStateToProps } from 'src/containers/posts/posts.interfaces';
import { PostList } from 'src/containers/posts/post-list';
import { PostPage } from 'src/containers/posts/post-page';
import './posts.css';

type PostsProps = PostsStateToProps & PostsDispatchToProps & RouteComponentProps<{}>;

export default class Posts extends React.Component<PostsProps> {
    constructor(props: PostsProps) {
        super(props);
    }

    componentDidMount() {
        this.props.subscribePosts();
    }

    componentWillUnmount() {
        this.props.unsuscribePosts();
    }

    render() {
        return (
            <div>
                <Route exact={ true } path="/blog/" component={ PostList } />
                <Route path="/blog/:year(\d{4})/:month(\d{1,2})/:day(\d{1,2})/:title" component={ PostPage } />
            </div>
        );
    }
}
