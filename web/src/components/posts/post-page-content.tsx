import { DateTime } from 'luxon'
import { memo, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { Post } from '../../redux/posts/reducers'

const PostPageContentImpl = ({ children, entry }: PropsWithChildren<{ entry: Post | null }>) => {
  const [t] = useTranslation()

  if (entry === null) {
    return <>{ children }</>
  }

  const createdDate = DateTime.fromJSDate(entry.date.toDate(), { zone: 'UTC' })
  const modifiedDate = entry.modifiedDate
    ? DateTime.fromJSDate(entry.modifiedDate!.toDate(), { zone: 'UTC' })
    : null
  return (
    <article className="postPage">
      <header>
        <h4 className="display-4">{ entry.title }</h4>
        <section>
          <span>
            { t('blog.created_at') }
            &nbsp;
          </span>
          <time dateTime={createdDate.toFormat('yyyy-MM-dd')}>
            { createdDate.toLocaleString({ ...DateTime.DATETIME_HUGE, timeZoneName: 'short' }) }
          </time>
          { modifiedDate && (
          <span>
            {' '}
            -
            { t('blog.modified_at') }
            &nbsp;
          </span>
          ) }
          { modifiedDate
            && (
              <time dateTime={modifiedDate.toFormat('yyyy-MM-dd')}>
                { modifiedDate.toLocaleString({ ...DateTime.DATETIME_HUGE, timeZoneName: 'short' }) }
              </time>
            ) }
        </section>
      </header>
      <figure className="header-figure" style={{ backgroundImage: `url(${entry.img})` }} />
      { children }
    </article>
  )
}

const PostPageContent = memo(PostPageContentImpl)
export default PostPageContent
