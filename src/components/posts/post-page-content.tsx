import { DateTime } from 'luxon'
import React, { memo } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'

import { Post } from '../../redux/posts/reducers'

type PostPageContentComponentType = React.FunctionComponent<{ entry: Post | null } & WithTranslation>

const PostPageContentImpl: PostPageContentComponentType = ({ children, entry, t }) => {
    if(entry === null) {
        return <>{ children }</>
    } else {
        const createdDate = DateTime.fromJSDate(entry.date.toDate(), { locale: 'UTC' })
        const modifiedDate = entry.modifiedDate ?
            DateTime.fromJSDate(entry.modifiedDate!.toDate(), { locale: 'UTC' }) :
            null
        return (
            <article className="postPage">
                <header>
                    <h4 className="display-4">{ entry.title }</h4>
                    <section>
                        <span>{ t('blog.created_at') }&nbsp;</span>
                        <time dateTime={ createdDate.toFormat('yyyy-MM-dd') }>
                            { createdDate.toLocaleString({ ...DateTime.DATETIME_HUGE, timeZoneName: 'short' }) }
                        </time>
                        { modifiedDate && <span> - { t('blog.modified_at') }&nbsp;</span> }
                        { modifiedDate &&
                        <time dateTime={ modifiedDate.toFormat('yyyy-MM-dd') }>
                            { modifiedDate.toLocaleString({ ...DateTime.DATETIME_HUGE, timeZoneName: 'short' }) }
                        </time> }
                    </section>
                </header>
                <figure className="header-figure" style={{ backgroundImage: `url(${entry.img})` }} />
                { children }
            </article>
        )
    }
}

export const PostPageContent = memo(withTranslation()(PostPageContentImpl))
