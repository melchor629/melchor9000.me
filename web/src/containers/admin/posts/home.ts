import { connect } from 'react-redux'
import { State } from '../../../redux/store'
import { remove, removeError } from '../../../redux/database/actions'
import PostsHomeComponent from '../../../components/admin/posts/home'
import { Post } from '../../../redux/posts/state'

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
  posts: state.database.posts?.snapshot as Post[] || [],
  deleting: state.database.posts?.doing || false,
  errorSaving: state.database.posts?.error,
  darkMode: state.effects.darkMode,
})

const mapDispatchToProps = (dispatch: any): PostsHomeDispatchToProps => ({
  delete: (post: Post) => dispatch(remove('posts', post)),
  clearError: () => dispatch(removeError('posts')),
})

export const PostsHome = connect(mapStateToProps, mapDispatchToProps)(PostsHomeComponent)
