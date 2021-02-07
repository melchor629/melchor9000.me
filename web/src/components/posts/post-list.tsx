import React from 'react'
import { Helmet } from 'react-helmet'
import type { PostListDispatchToProps, PostListStateToPros } from '../../containers/posts/post-list'
import LoadSpinner from '../load-spinner'
import Entry from './post-entry'

type PostListProps = PostListStateToPros & PostListDispatchToProps

export default class PostList extends React.Component<PostListProps, any> {
  private observer?: IntersectionObserver

  constructor(props: PostListProps) {
    super(props)
    this.state = {
      spinnerRef: React.createRef<HTMLElement>(),
    }
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      const { scroll } = this.props
      window.scrollTo(window.scrollX, scroll)
    })
  }

  componentDidUpdate() {
    const { posts, postsCount } = this.props
    if (!this.observer && (posts?.length ?? 0) < postsCount) {
      const { spinnerRef } = this.state
      this.observer = new IntersectionObserver((entries) => {
        if (entries.filter((entry) => entry.isIntersecting).length) {
          const { showMore } = this.props
          showMore(6)
        }
      }, { rootMargin: '100px 0px' })
      this.observer.observe(spinnerRef.current)
    }
  }

  componentWillUnmount() {
    const { saveScroll } = this.props
    saveScroll(window.scrollY)

    if (this.observer) {
      this.observer.disconnect()
    }
  }

  render() {
    const { posts, postsCount } = this.props
    const { spinnerRef } = this.state
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

          {posts.length < postsCount && <div className="w-100" ref={spinnerRef}><LoadSpinner /></div>}
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
