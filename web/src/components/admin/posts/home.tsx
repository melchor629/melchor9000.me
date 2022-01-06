/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { Helmet } from 'react-helmet'
import app from '../../../lib/firebase'
import * as toast from '../../../lib/toast'
import type { PostsHomeDispatchToProps, PostsHomeStateToProps } from '../../../containers/admin/posts/home'
import { Post } from '../../../redux/posts/reducers'
import DeleteModal from '../delete-modal'
import PostRow from './post-row'

type PostsPageProps = PostsHomeStateToProps & PostsHomeDispatchToProps

const PostsHome = ({
  clearError,
  darkMode,
  delete: deletePost,
  deleting,
  errorSaving,
  posts,
}: PostsPageProps) => {
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)

  const effectivelyDeletePost = useCallback(() => {
    if (!postToDelete) {
      return
    }

    deleteObject(ref(getStorage(app), postToDelete.file))
      .then(() => {
        deletePost(postToDelete)
      })
      .catch((error) => {
        toast.error(
          <div>
            No se pudo borrar el contenido del post
            <br />
            <span className="text-muted">{error.toString()}</span>
          </div>,
        )
      })
  }, [postToDelete, deletePost])

  useEffect(() => {
    if (!deleting && errorSaving) {
      toast.error(
        <div>
          No se pudo borrar los metadatos del post...
          <br />
          <span className="text-muted">{errorSaving.toString()}</span>
        </div>,
      )
      clearError()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleting])

  return (
    <div>

      <Helmet>
        <title>Posts - Admin</title>
      </Helmet>

      <div className="row align-items-center">
        <div className="col"><h1>Posts</h1></div>
        <div className="col-auto">
          <Link to="create" className="btn btn-sm btn-outline-success mb-2">
            <i className="fas fa-plus" />
          </Link>
        </div>
      </div>
      <table className={`table ${darkMode ? 'table-dark' : 'table-light'} table-hover`}>
        <thead className={darkMode ? 'thead-dark' : 'thead-light'}>
          <tr>
            <th>Título</th>
            <th>Fecha de publicación</th>
            <th><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {posts && posts.map((post) => (
            <PostRow key={post._id} post={post} setPostToDelete={setPostToDelete} />
          )) }
        </tbody>
      </table>

      <DeleteModal
        item={postToDelete}
        onClose={useCallback(() => setPostToDelete(null), [])}
        onDelete={effectivelyDeletePost}
      />
    </div>
  )
}

export default PostsHome
