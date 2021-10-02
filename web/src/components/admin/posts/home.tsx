/* eslint-disable no-underscore-dangle */
import * as React from 'react'
import { Link } from 'react-router-dom'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { Helmet } from 'react-helmet'
import app from '../../../lib/firebase'
import * as toast from '../../../lib/toast'
import type { PostsHomeDispatchToProps, PostsHomeStateToProps } from '../../../containers/admin/posts/home'
import { Post } from '../../../redux/posts/reducers'
import DeleteModal from '../delete-modal'

type PostsPageProps = PostsHomeStateToProps & PostsHomeDispatchToProps

interface PostHomeState {
  postToDelete: Post | null
}

export default class PostsHome extends React.Component<PostsPageProps, PostHomeState> {
  constructor(props: PostsPageProps) {
    super(props)
    this.state = { postToDelete: null }
  }

  componentDidUpdate(prevProps: PostsPageProps) {
    const { deleting, errorSaving, clearError } = this.props
    if (prevProps.deleting && !deleting) {
      if (errorSaving) {
        toast.error(
          <div>
            No se pudo borrar los metadatos del post...
            <br />
            <span className="text-muted">{errorSaving.toString()}</span>
          </div>,
        )
        clearError()
      }
    }
  }

  private selectForDeleting(e: React.MouseEvent<HTMLButtonElement>, post: Post) {
    e.preventDefault()
    this.setState({ postToDelete: post })
  }

  private deletePost() {
    const { postToDelete: post } = this.state
    const { delete: deletePost } = this.props

    deleteObject(ref(getStorage(app), post!.file))
      .then(() => {
        deletePost(post!)
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
  }

  render() {
    const { darkMode, posts } = this.props
    const { postToDelete } = this.state
    const postUrl = (post: Post) => {
      const date = post.date.toDate()
      return `/blog/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${post.url}`
    }

    return (
      <div>

        <Helmet>
          <title>Posts - Admin</title>
        </Helmet>

        <div className="row align-items-center">
          <div className="col"><h1>Posts</h1></div>
          <div className="col-auto">
            <Link to="/admin/posts/create" className="btn btn-sm btn-outline-success mb-2">
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
              <tr key={post._id} className="admin-list-row">
                <td><Link to={postUrl(post)}>{ post.title }</Link></td>
                <td>{ post.date.toDate().toLocaleString() }</td>
                <td className="admin-list-row-actions">
                  <Link
                    to={`/admin/posts/edit/${post._id}`}
                    className="btn btn-sm btn-outline-warning"
                  >
                    <i className="fas fa-pencil-alt" />
                  </Link>
                  &nbsp;
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => this.selectForDeleting(e, post)}
                  >
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>

        <DeleteModal
          item={postToDelete}
          onClose={() => this.setState({ postToDelete: null })}
          onDelete={() => this.deletePost()}
        />
      </div>
    )
  }
}
