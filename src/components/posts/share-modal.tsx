import React, { memo } from 'react';
import { default as Ink } from 'react-ink';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Post } from '../../redux/posts/reducers';

interface ShareItemProps {
    onClick: () => void;
    fab?: string;
    fas?: string;
    children: string;
}

const ShareItem: React.FunctionComponent<ShareItemProps> = memo(({ onClick, fab, fas, children }) => (
    <div className="share-link" onClick={ onClick }>
        <div className="row">
            <div className="col-2">
                <i className={[fab && `fab fa-${fab}`, fas && `fas fa-${fas}`].filter(f => !!f).join(' ')}/>
            </div>
            <div className="col-10">{ children }</div>
        </div>
        <Ink />
    </div>
));

type ShareModalComponentType = React.FunctionComponent<{ post: Post } & WithTranslation>;

const ShareModalImpl: ShareModalComponentType = ({ post, t }) => {
    return (
        <div className="modal share-modal fade" id="share-modal" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-sm">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title">{ t('blog.share') }</h2>
                    </div>
                    <div className="modal-body">
                        <ShareItem onClick={ twitterButtonPressed } fab="twitter">Twitter</ShareItem>
                        <ShareItem onClick={ redditButtonPressed } fab="reddit">Reddit</ShareItem>
                        <ShareItem onClick={ telegramButtonPressed } fab="telegram">Telegram</ShareItem>

                        { /ipad|iphone|ipod|android/.test(navigator.userAgent.toLowerCase()) &&
                            <ShareItem onClick={ whatsappButtonPressed } fab="whatsapp">WhatsApp</ShareItem>
                        }

                        <ShareItem onClick={ linkedinButtonPressed } fab="linkedin">LinkedIn</ShareItem>
                        <ShareItem onClick={ facebookButtonPressed } fab="facebook">Facebook</ShareItem>
                        <ShareItem onClick={ emailButtonPressed } fas="envelope">Email</ShareItem>
                    </div>
                </div>
            </div>
        </div>
    );

    function query(object: any): string {
        return (Object['entries'](object) as [string, string][]).map(pair => `${pair[0]}=${pair[1]}`).join('&');
    }

    function twitterButtonPressed() {
        let q = query({
            text: encodeURIComponent(post.title),
            url: encodeURIComponent(window.location.toString()),
            via: 'melchor629',
            related: 'melchor629%3AMelchor%20Garau%20Madrigal',
        });
        window.open(`http://twitter.com/intent/tweet?${q}`);
    }

    function telegramButtonPressed() {
        window.location.assign(`tg://msg_url?url=${encodeURIComponent(window.location.toString())}`);
    }

    function whatsappButtonPressed() {
        window.location.assign(`whatsapp://send?text=${encodeURIComponent(post.title + ': ' + window.location)}`);
    }

    function emailButtonPressed() {
        let q = query({
            subject: encodeURIComponent(`${post.title} - melchor9000`),
            body: encodeURIComponent(
                'Lee la entrada de la morada de melchor9000:\n' +
                '\t' + post.title + '\n' +
                '\t' + window.location.toString()
            )
        });
        window.open(`mailto:?${q}`);
    }

    function redditButtonPressed() {
        const url = encodeURIComponent(window.location.toString());
        const title = encodeURIComponent(post.title);
        window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`);
    }

    function linkedinButtonPressed() {
        const url = encodeURIComponent(window.location.toString());
        const title = encodeURIComponent(post.title);
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`);
    }

    function facebookButtonPressed() {
        const url = encodeURIComponent(window.location.toString());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    }

};

export const ShareModal = memo(withTranslation()(ShareModalImpl));
