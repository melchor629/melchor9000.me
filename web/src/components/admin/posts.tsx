import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { PostsDispatchToProps, PostsStateToProps } from '../../containers/admin/posts'
import { PostsHome } from '../../containers/admin/posts/home'
import { PostEditor } from '../../containers/admin/posts/editor'

type PostsPageProps = PostsStateToProps & PostsDispatchToProps

const Posts = ({ subscribe, unsubscribe }: PostsPageProps) => {
  useEffect(() => {
    subscribe()

    return () => unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Routes>
      <Route index element={<PostsHome />} />
      <Route path="create" element={<PostEditor />} />
      <Route path="edit/:id" element={<PostEditor />} />
    </Routes>
  )
}

export default Posts
