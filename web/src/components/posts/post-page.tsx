import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Helmet } from 'react-helmet'
import { WithTranslation } from 'react-i18next'
import { Post } from '../../redux/posts/reducers'
import type { PostPageDispatchToProps, PostPageStateToProps } from '../../containers/posts/post-page'
import LoadSpinner from '../load-spinner/load-spinner'
import Zoom from '../../lib/zoom.js/zoom'
import DisqusWrapper from './disqus-wrapper'
import PostPageContent from './post-page-content'
import 'highlight.js/styles/vs2015.css'

interface RouteParams {
  year: string
  month: string
  day: string
  title: string
}

type PostPageProps = PostPageStateToProps
& PostPageDispatchToProps
& RouteComponentProps<RouteParams>
& WithTranslation

interface PostPageState {
  entry: Post | null
  notFound: boolean
}

export default class PostPage extends React.Component<PostPageProps, PostPageState> {
  private readonly zoomjs: Zoom = new Zoom()

  constructor(props: PostPageProps) {
    super(props)
    this.state = {
      entry: null,
      notFound: false,
    }
  }

  componentDidMount() {
    (requestAnimationFrame || setTimeout)(() => {
      window.scrollTo(window.scrollX, 0)
      this.zoomjs.listen('img')
    })

    const { posts } = this.props
    if (posts) {
      this.findPost()
    }
  }

  componentDidUpdate() {
    // @ts-ignore
    const { MathJax, twttr } = window
    MathJax?.Hub.Queue(['Typeset', MathJax.Hub])
    twttr?.widgets?.load()

    const { entry, notFound } = this.state
    if (!entry && !notFound) {
      this.findPost()
    }
  }

  componentWillUnmount() {
    this.zoomjs.dispose()
  }

  private findPost() {
    const { posts, match, loadPost } = this.props
    if (posts) {
      const {
        year, month, day, title,
      } = match.params
      const postsMatching = posts
        .filter((post) => post.date.toDate().getUTCFullYear() === Number(year))
        .filter((post) => post.date.toDate().getUTCMonth() === Number(month) - 1)
        .filter((post) => post.date.toDate().getUTCDate() === Number(day))
        .filter((post) => post.url === title)
      if (postsMatching.length === 1) {
        this.setState({ entry: postsMatching[0] })
        loadPost(postsMatching[0])
      } else if (postsMatching.length === 0) {
        this.setState({ notFound: true })
      } else {
        console.error(postsMatching)
        throw new Error('More than one post matches this url')
      }
    }
  }

  render() {
    let domContent
    let disqusConfig
    const { content } = this.props
    const { entry, notFound } = this.state
    if (content) {
      domContent = (
        // eslint-disable-next-line react/no-danger
        <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
      )
      if (entry) {
        disqusConfig = {
          url: window.location.toString(),
          // eslint-disable-next-line no-underscore-dangle
          identifier: entry!._id!,
          title: entry!.title,
        }
      }
    } else if (!notFound) {
      domContent = (
        <section className="content d-flex justify-content-center">
          <LoadSpinner />
        </section>
      )
    } else {
      domContent = (
        <section className="content">
          No existe esto pisha
        </section>
      )
    }

    let title: string
    if (notFound) {
      title = 'Post not found - Posts'
    } else if (entry === null) {
      title = 'Loading ... - Posts'
    } else {
      title = `${entry.title} - Posts`
    }

    return (
      <main>
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <PostPageContent entry={entry}>{ domContent }</PostPageContent>
        <DisqusWrapper shortName="personal-website-11" config={disqusConfig} />
      </main>
    )
  }
}
