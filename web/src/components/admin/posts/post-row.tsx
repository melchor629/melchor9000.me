import { MouseEvent, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ID } from '../../../redux/database/state'
import { Post } from '../../../redux/posts/state'

interface PostRowProps {
  post: Post
  setPostToDelete: (post: Post) => void
}

const PostRow = ({ post, setPostToDelete }: PostRowProps) => {
  const postUrl = useMemo(() => {
    const date = post.date.toDate()
    return `/blog/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${post.url}`
  }, [post.date, post.url])

  const selectForDeleting = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPostToDelete(post)
  }, [post, setPostToDelete])

  return (
    <tr className="admin-list-row">
      <td><Link to={postUrl}>{post.title}</Link></td>
      <td>{post.date.toDate().toLocaleString()}</td>
      <td className="admin-list-row-actions">
        <Link
          to={`edit/${post[ID]}`}
          className="btn btn-sm btn-outline-warning"
        >
          <i className="fas fa-pencil-alt" />
        </Link>
        &nbsp;
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={selectForDeleting}
        >
          <i className="fas fa-trash" />
        </button>
      </td>
    </tr>
  )
}

export default PostRow
