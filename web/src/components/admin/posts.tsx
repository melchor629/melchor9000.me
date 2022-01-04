import { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { PostsDispatchToProps, PostsStateToProps } from '../../containers/admin/posts'
import { PostsHome } from '../../containers/admin/posts/home'
import { PostEditor } from '../../containers/admin/posts/editor'

type PostsPageProps = PostsStateToProps & PostsDispatchToProps

export default class Posts extends Component<PostsPageProps> {
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
      <Routes>
        <Route index element={<PostsHome />} />
        <Route path="create" element={<PostEditor />} />
        <Route path="edit/:id" element={<PostEditor />} />
      </Routes>
    )
  }
}
