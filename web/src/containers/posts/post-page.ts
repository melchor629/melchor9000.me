import { connect } from 'react-redux'
import { Post } from '../../redux/posts/reducers'
import { State } from '../../redux/reducers'
import { getPost } from '../../redux/posts/actions'
import PostPageComponent from '../../components/posts/post-page'

export interface PostPageStateToProps {
  content: string | null
  posts: Post[] | null
}

export interface PostPageDispatchToProps {
  loadPost: (post: Post) => void
}

const mapStateToProps = ({ database, posts }: State): PostPageStateToProps => ({
  content: posts.content,
  posts: database.snapshots.posts,
})

const mapDispatchToProps = (dispatch: any): PostPageDispatchToProps => ({
  loadPost: (post: Post) => dispatch(getPost(post)),
})

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(PostPageComponent)
