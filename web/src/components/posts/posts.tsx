import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import { PostsDispatchToProps, PostsStateToProps } from '../../containers/posts/posts.interfaces'
import { PostList } from '../../containers/posts/post-list'
import { PostPage } from '../../containers/posts/post-page'
import './posts.scss'

type PostsProps = PostsStateToProps & PostsDispatchToProps

const Posts = ({ subscribePosts, unsuscribePosts }: PostsProps) => {
  useEffect(() => {
    subscribePosts()
    return () => unsuscribePosts()
  }, []); //eslint-disable-line

  return (
    <Routes>
      <Route index element={<PostList />} />
      <Route path=":year/:month/:day/:title" element={<PostPage />} />
    </Routes>
  )
}

export default Posts
