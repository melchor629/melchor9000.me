import React from 'react';
import { RouteComponentProps } from 'react-router';
import { default as Ink } from 'react-ink';
import { Helmet } from 'react-helmet';
import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment';
import $ from 'jquery';
import { Post } from '../../redux/posts/reducers';
import { PostPageDispatchToProps, PostPageStateToProps } from '../../containers/posts/post-page';
import LoadSpinner from '../load-spinner/load-spinner';
import Zoom from '../../lib/zoom.js/zoom';
import 'highlight.js/styles/vs2015.css';
import DisqusWrapper from '../posts/disqus-wrapper';

const ShareItem = ({ onClick, fa, children }: { onClick: any, fa: string, children: string }) => (
    <div className="share-link" onClick={ onClick }>
        <div className="row">
            <div className="col-2"><i className={`fa fa-${fa}`}/></div>
            <div className="col-10">{ children }</div>
        </div>
        <Ink />
    </div>
);

class ShareModal extends React.Component<{ post: Post | null } & WithTranslation> {

    private static query(object: any): string {
        return (Object['entries'](object) as [string, string][]).map(pair => `${pair[0]}=${pair[1]}`).join('&');
    }

    constructor(props: { post: Post | null } & WithTranslation) {
        super(props);
        this.telegramButtonPressed = this.telegramButtonPressed.bind(this);
        this.whatsappButtonPressed = this.whatsappButtonPressed.bind(this);
        this.linkedinButtonPressed = this.linkedinButtonPressed.bind(this);
        this.facebookButtonPressed = this.facebookButtonPressed.bind(this);
        this.twitterButtonPressed = this.twitterButtonPressed.bind(this);
        this.redditButtonPressed = this.redditButtonPressed.bind(this);
        this.emailButtonPressed = this.emailButtonPressed.bind(this);
    }

    render() {
        return (
            <div className="modal share-modal fade" id="share-modal" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">{this.props.t('blog.share')}</h2>
                        </div>
                        <div className="modal-body">
                            <ShareItem onClick={ this.twitterButtonPressed } fa="twitter">Twitter</ShareItem>
                            <ShareItem onClick={ this.redditButtonPressed } fa="reddit">Reddit</ShareItem>
                            <ShareItem onClick={ this.telegramButtonPressed } fa="telegram">Telegram</ShareItem>

                            { /ipad|iphone|ipod|android/.test(navigator.userAgent.toLowerCase()) &&
                                <ShareItem onClick={ this.whatsappButtonPressed } fa="whatsapp">WhatsApp</ShareItem>
                            }

                            <ShareItem onClick={ this.linkedinButtonPressed } fa="linkedin">LinkedIn</ShareItem>
                            <ShareItem onClick={ this.facebookButtonPressed } fa="facebook">Facebook</ShareItem>
                            <ShareItem onClick={ this.emailButtonPressed } fa="envelope">Email</ShareItem>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private twitterButtonPressed() {
        const post = this.props.post!;
        let query = ShareModal.query({
            text: encodeURIComponent(post.title),
            url: encodeURIComponent(window.location.toString()),
            via: 'melchor629',
            related: 'melchor629%3AMelchor%20Garau%20Madrigal',
        });
        window.open(`http://twitter.com/intent/tweet?${query}`);
    }

    private telegramButtonPressed() {
        window.location.assign(`tg://msg_url?url=${encodeURIComponent(window.location.toString())}`);
    }

    private whatsappButtonPressed() {
        const post = this.props.post!;
        window.location.assign(`whatsapp://send?text=${encodeURIComponent(post.title + ': ' + window.location)}`);
    }

    private emailButtonPressed() {
        const post = this.props.post!;
        let query = ShareModal.query({
            subject: encodeURIComponent(`${post.title} - melchor9000`),
            body: encodeURIComponent(
                'Lee la entrada de la morada de melchor9000:\n' +
                '\t' + post.title + '\n' +
                '\t' + window.location.toString()
            )
        });
        window.open(`mailto:?${query}`);
    }

    private redditButtonPressed() {
        const url = encodeURIComponent(window.location.toString());
        const title = encodeURIComponent(this.props.post!.title);
        window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`);
    }

    private linkedinButtonPressed() {
        const url = encodeURIComponent(window.location.toString());
        const title = encodeURIComponent(this.props.post!.title);
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`);
    }

    private facebookButtonPressed() {
        const url = encodeURIComponent(window.location.toString());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    }

}

class PostHeader extends React.Component<{ entry: Post | null } & WithTranslation> {
    render() {
        if(this.props.entry === null) {
            return this.props.children;
        } else {
            const { entry, t } = this.props;
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
                    { this.props.children }
                </article>
            );
        }
    }
}

const ShareModalT = withTranslation()(ShareModal);
const PostHeaderT = withTranslation()(PostHeader);

interface RouteParams {
    year: string;
    month: string;
    day: string;
    title: string;
}

type PostPageProps = PostPageStateToProps & PostPageDispatchToProps & RouteComponentProps<RouteParams> &
    WithTranslation;

interface PostPageState {
    entry: Post | null;
    notFound: boolean;
}

export default class PostPage extends React.Component<PostPageProps, PostPageState> {

    private zoomjs: Zoom = new Zoom();

    constructor(props: PostPageProps) {
        super(props);
        this.state = {
            entry: null,
            notFound: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            window.scrollTo(window.scrollX, 0);
            this.zoomjs.listen('img');
        });

        if(this.props.posts) {
            this.findPost();
        }
    }

    componentWillUnmount() {
        this.zoomjs.dispose();
    }

    componentDidUpdate() {
        window['MathJax'].Hub.Queue(['Typeset', window['MathJax'].Hub]);
        if(!this.state.entry && !this.state.notFound) {
            this.findPost();
        }
    }

    render() {
        let domContent, disqusConfig;
        if(this.props.content) {
            domContent = (
                <section className="content" dangerouslySetInnerHTML={{ __html: this.props.content }} />
            );
            if(this.state.entry) {
                disqusConfig = {
                    url: window.location.toString(),
                    identifier: this.state.entry!._id!,
                    title: this.state.entry!.title,
                };
            }
        } else if(!this.state.notFound) {
            domContent = (
                <section className="content d-flex justify-content-center">
                    <LoadSpinner />
                </section>
            );
        } else {
            domContent = (
                <section className="content">
                    No existe esto pisha
                </section>
            );
        }

        const styles = window.document.body.clientWidth > 568 ? { top: 15, right: 40 } : { bottom: 45, right: 20 };

        return (
            <div>

                <Helmet>
                    <title>{this.state.notFound ? 'Post not found' : (this.state.entry === null ? `Loading... - Posts` :
                        `${this.state.entry.title} - Posts`)}</title>
                </Helmet>

                <div className="circle-button share"
                     style={{ ...styles }}
                     onClick={ () => ($('#share-modal') as any).modal('show') }>
                    <i className="fa fa-share"/>
                </div>

                <PostHeaderT entry={ this.state.entry }>{ domContent }</PostHeaderT>
                <DisqusWrapper shortName={'personal-website-11'} config={disqusConfig} />
                <ShareModalT post={ this.state.entry } />
            </div>
        );
    }

    private findPost() {
        const { year, month, day, title } = this.props.match.params;
        const postsMatching = this.props.posts!
            .filter(post => post.date.toDate().getUTCFullYear() === Number(year))
            .filter(post => post.date.toDate().getUTCMonth() === Number(month) - 1)
            .filter(post => post.date.toDate().getUTCDate() === Number(day))
            .filter(post => post.url === title);
        if(postsMatching.length === 1) {
            setTimeout(() => this.setState({ entry: postsMatching[0] }));
            this.props.loadPost(postsMatching[0]);
        } else if(postsMatching.length === 0) {
            setTimeout(() => this.setState({ notFound: true }));
        } else {
            console.error(postsMatching);
            throw new Error('More than one post matches this url');
        }
    }
}
