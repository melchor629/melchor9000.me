import { connect } from 'react-redux'
import PostComponent from '../../components/posts/posts'
import { subscribe, unsubscribe } from '../../redux/database/actions'
import { PostsDispatchToProps, PostsStateToProps } from './posts.interfaces'

const mapStateToProps = (): PostsStateToProps => ({})

const mapDispatchToProps = (dispatch: any): PostsDispatchToProps => ({
  subscribePosts: () => dispatch(subscribe('posts', '-date', [['date', '<=', new Date()], ['hide', '==', false]])),
  unsuscribePosts: () => dispatch(unsubscribe('posts')),
})

const Posts = connect(mapStateToProps, mapDispatchToProps)(PostComponent)
export default Posts
