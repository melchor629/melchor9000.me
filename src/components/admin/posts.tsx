import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { PostsDispatchToProps, PostsStateToProps } from '../../containers/admin/posts';
import { PostsHome } from '../../containers/admin/posts/home';
import { PostEditor } from '../../containers/admin/posts/editor';

type PostsPageProps = PostsStateToProps & PostsDispatchToProps;

export default class Posts extends React.Component<PostsPageProps> {

    componentDidMount() {
        this.props.changeTitle('Posts - Admin');
        this.props.subscribe();
    }

    componentWillUnmount() {
        this.props.unsubscribe();
    }

    render() {
        return (
            <Switch>
                <Route exact={ true } path="/admin/posts/" component={ PostsHome } />
                <Route path="/admin/posts/create" component={ PostEditor } />
                <Route path="/admin/posts/edit/:id" component={ PostEditor } />
            </Switch>
        );
    }

}