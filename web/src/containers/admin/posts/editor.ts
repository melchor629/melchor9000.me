import { connect } from 'react-redux'
import { State } from '../../../redux/store'
import { insert, removeError, update } from '../../../redux/database/actions'
import PostEditorComponent from '../../../components/admin/posts/editor'
import { Post } from '../../../redux/posts/state'

export interface PostEditorStateToProps {
  saving: boolean
  errorSaving: any | null
  darkMode: boolean
}

export interface PostEditorDispatchToProps {
  save: (post: Post) => void
  update: (post: Post) => void
  clearError: () => void
}

const mapStateToProps = (state: State): PostEditorStateToProps => ({
  saving: state.database.posts?.doing || false,
  errorSaving: state.database.posts?.error,
  darkMode: state.effects.darkMode,
})

const mapDispatchToProps = (dispatch: any): PostEditorDispatchToProps => ({
  save: (post: Post) => dispatch(insert('posts', post)),
  update: (post: Post) => dispatch(update('posts', post)),
  clearError: () => dispatch(removeError('posts')),
})

export const PostEditor = connect(mapStateToProps, mapDispatchToProps)(PostEditorComponent)
