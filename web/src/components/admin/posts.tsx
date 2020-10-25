import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import type { PostsDispatchToProps, PostsStateToProps } from '../../containers/admin/posts'
import { PostsHome } from '../../containers/admin/posts/home'
import { PostEditor } from '../../containers/admin/posts/editor'

type PostsPageProps = PostsStateToProps & PostsDispatchToProps

export default class Posts extends React.Component<PostsPageProps> {
  componentDidMount() {
    const { subscribe } = this.props
    subscribe()
  }

  componentWillUnmount() {
    const { unsubscribe } = this.props
    unsubscribe()
  }

  render() {
    return (
      <Switch>
        <Route exact path="/admin/posts/" component={PostsHome} />
        <Route path="/admin/posts/create" component={PostEditor} />
        <Route path="/admin/posts/edit/:id" component={PostEditor} />
      </Switch>
    )
  }
}
