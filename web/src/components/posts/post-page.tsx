import { useLayoutEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet'
import type { PostPageDispatchToProps, PostPageStateToProps } from '../../containers/posts/post-page'
import LoadSpinner from '../load-spinner/load-spinner'
import Zoom from '../../lib/zoom.js/zoom'
import DisqusWrapper from './disqus-wrapper'
import PostPageContent from './post-page-content'
import 'highlight.js/styles/vs2015.css'

type PostPageProps = PostPageStateToProps & PostPageDispatchToProps

const PostPage = ({ loadPost, content, posts }: PostPageProps) => {
  const zoomjs = useMemo(() => new Zoom(), [])

  const {
    year, month, day, title,
  } = useParams()
  const [entry, notFound] = useMemo(() => {
    if (!posts) {
      return [null, false] as const
    }

    const yearn = parseInt(year!, 10)
    const monthn = parseInt(month!, 10)
    const dayn = parseInt(day!, 10)

    const postsMatching = posts
      .filter((post) => {
        const date = post.date.toDate()
        return date.getUTCFullYear() === yearn
          && date.getUTCMonth() === monthn - 1
          && date.getUTCDate() === dayn
          && post.url === title
      })
    if (postsMatching.length === 1) {
      loadPost(postsMatching[0])
      return [postsMatching[0], false] as const
    }

    if (postsMatching.length === 0) {
      return [null, true] as const
    }

    console.error(postsMatching)
    throw new Error('More than one post matches this url')
  }, [posts, year, month, day, title, loadPost])

  const pageTitle = useMemo(() => {
    if (notFound) {
      return 'Post not found - Posts'
    }
    if (entry === null) {
      return 'Loading ... - Posts'
    }

    return `${entry.title} - Posts`
  }, [notFound, entry])

  useLayoutEffect(() => {
    (requestAnimationFrame || setTimeout)(() => {
      window.scrollTo(window.scrollX, 0)
      zoomjs.listen('img')
    })

    return () => zoomjs.dispose()
  }, [zoomjs])

  useLayoutEffect(() => {
    // @ts-ignore
    const { MathJax, twttr } = window
    MathJax?.Hub.Queue(['Typeset', MathJax.Hub])
    twttr?.widgets?.load()
  })

  let domContent
  let disqusConfig
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

  return (
    <main>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <PostPageContent entry={entry}>{ domContent }</PostPageContent>
      <DisqusWrapper shortName="personal-website-11" config={disqusConfig} />
    </main>
  )
}

export default PostPage
