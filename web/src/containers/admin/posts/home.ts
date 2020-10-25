import { connect } from 'react-redux'
import { State } from '../../../redux/reducers'
import { remove, removeError } from '../../../redux/database/actions'
import PostsHomeComponent from '../../../components/admin/posts/home'
import { Post } from '../../../redux/posts/reducers'

export interface PostsHomeStateToProps {
  posts: Post[] | null | undefined
  deleting: boolean
  errorSaving: any | null
  darkMode: boolean
}

export interface PostsHomeDispatchToProps {
  delete: (post: Post) => void
  clearError: () => void
}

const mapStateToProps = (state: State): PostsHomeStateToProps => ({
  posts: state.database.snapshots.posts,
  deleting: state.database.doing.posts || false,
  errorSaving: state.database.errors.posts,
  darkMode: state.effects.darkMode,
})

const mapDispatchToProps = (dispatch: any): PostsHomeDispatchToProps => ({
  delete: (post: Post) => dispatch(remove('posts', post)),
  clearError: () => dispatch(removeError('posts')),
})

export const PostsHome = connect(mapStateToProps, mapDispatchToProps)(PostsHomeComponent)
