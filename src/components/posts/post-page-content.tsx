import moment from 'moment';
import React, { memo } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Post } from '../../redux/posts/reducers';

type PostPageContentComponentType = React.FunctionComponent<{ entry: Post | null } & WithTranslation>;

const PostPageContentImpl: PostPageContentComponentType = ({ children, entry, t }) => {
    if(entry === null) {
        return <>{ children }</>;
    } else {
        const createdDate = moment(entry.date.toDate());
        const modifiedDate = entry.modifiedDate ? moment(entry.modifiedDate!.toDate()) : null;
        return (
            <article className="postPage">
                <header>
                    <h4 className="display-4">{ entry.title }</h4>
                    <section>
                        <span>{ t('blog.created_at') }&nbsp;</span>
                        <time dateTime={ createdDate.format('YYYY-MM-DD') }>
                            { createdDate.format('LLL') }
                        </time>
                        { modifiedDate && <span> - { t('blog.modified_at') }&nbsp;</span> }
                        { modifiedDate &&
                        <time dateTime={ modifiedDate.format('YYYY-MM-DD') }>
                            { modifiedDate.format('LLL') }
                        </time> }
                    </section>
                </header>
                <figure className="header-figure" style={{ backgroundImage: `url(${entry.img})` }} />
                { children }
            </article>
        );
    }
};

export const PostPageContent = memo(withTranslation()(PostPageContentImpl));
