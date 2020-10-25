import React from 'react'
import $ from 'jquery'
import { Helmet } from 'react-helmet'
import type { PostListDispatchToProps, PostListStateToPros } from '../../containers/posts/post-list'
import LoadSpinner from '../load-spinner'
import Entry from './post-entry'

type PostListProps = PostListStateToPros & PostListDispatchToProps

export default class PostList extends React.Component<PostListProps> {
  constructor(props: PostListProps) {
    super(props)
    this.windowScrolled = this.windowScrolled.bind(this)
    this.windowResized = this.windowResized.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      const { scroll } = this.props
      window.scrollTo(window.scrollX, scroll)
    })

    window.addEventListener('scroll', this.windowScrolled, { passive: true })
    window.addEventListener('resize', this.windowResized, { passive: true })
  }

  componentDidUpdate(prevProps: PostListProps) {
    const { posts } = this.props
    if (prevProps.posts === null && posts !== null) {
      requestAnimationFrame(() => this.windowScrolled())
    }
  }

  componentWillUnmount() {
    const { saveScroll } = this.props
    saveScroll(window.scrollY)

    window.removeEventListener('scroll', this.windowScrolled)
    window.removeEventListener('resize', this.windowResized)
  }

  private windowScrolled() {
    const { posts, postsCount, showMore } = this.props
    if (posts) {
      if (posts.length < postsCount) {
        const abajoPos = window.scrollY + $(window).height()!
        if (abajoPos > $('.mainPage').height()! - 70) {
          showMore(6)
          if (posts!.length + 3 >= postsCount) {
            window.removeEventListener('scroll', this.windowScrolled)
          }
        }
      }
    }
  }

  private windowResized() {
    this.forceUpdate()
  }

  render() {
    const { posts } = this.props
    if (posts) {
      const entries = posts
        .filter((e) => !e.hide)
        // eslint-disable-next-line no-underscore-dangle
        .map((entry) => <Entry entry={entry} key={entry._id!} />)

      return (
        <div className="mainPage d-flex flex-wrap">

          <Helmet>
            <title>Posts</title>
            <meta
              name="Description"
              content="Blog of melchor9000"
            />
          </Helmet>

          { entries }
        </div>
      )
    }

    return (
      <div className="mainPage row justify-content-center">

        <Helmet>
          <title>Loading... - Posts</title>
        </Helmet>

        <LoadSpinner />
      </div>
    )
  }
}
