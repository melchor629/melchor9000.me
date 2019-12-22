import { connect } from 'react-redux'
import PostComponent from '../../components/posts/posts'
import { State } from '../../redux/reducers'
import { subscribe, unsubscribe } from '../../redux/database/actions'
import { PostsDispatchToProps, PostsStateToProps } from './posts.interfaces'

const mapStateToProps = (state: State): PostsStateToProps => ({})

const mapDispatchToProps = (dispatch: any): PostsDispatchToProps => ({
    subscribePosts: () => dispatch(subscribe('posts', '-date', '<=', new Date())),
    unsuscribePosts: () => dispatch(unsubscribe('posts')),
})

export const Posts = connect(mapStateToProps, mapDispatchToProps)(PostComponent)
