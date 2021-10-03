import { DateTime } from 'luxon'
import { memo, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import ShareModal from './share-modal'
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
        <figure className="header-figure" style={{ backgroundImage: `url(${entry.img})` }} />
        <section className="small mt-4">
          <span>
            { t('blog.created_at') }
            &nbsp;
          </span>
          <time dateTime={createdDate.toFormat('yyyy-MM-dd')}>
            { createdDate.toLocal().toLocaleString({ ...DateTime.DATETIME_HUGE, timeZoneName: 'short' }) }
          </time>
          { modifiedDate && (
            <>
              <br />
              <span>
                { t('blog.modified_at') }
                &nbsp;
              </span>
              <time dateTime={modifiedDate.toFormat('yyyy-MM-dd')}>
                { modifiedDate.toLocal().toLocaleString({ ...DateTime.DATETIME_HUGE, timeZoneName: 'short' }) }
              </time>
            </>
          ) }
        </section>
        <section>
          {entry && <ShareModal post={entry} />}
        </section>
      </header>
      { children }
    </article>
  )
}

const PostPageContent = memo(PostPageContentImpl)
export default PostPageContent
