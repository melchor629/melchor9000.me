import { connect } from 'react-redux'
import { Post } from '../../redux/posts/state'
import { State } from '../../redux/store'
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
  posts: database.posts?.snapshot as Post[] | null,
})

const mapDispatchToProps = (dispatch: any): PostPageDispatchToProps => ({
  loadPost: (post: Post) => dispatch(getPost(post)),
})

export const PostPage = connect(mapStateToProps, mapDispatchToProps)(PostPageComponent)
