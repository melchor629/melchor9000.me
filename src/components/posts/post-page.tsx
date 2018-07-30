import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { default as Ink } from 'react-ink';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { Post } from 'src/redux/posts/reducers';
import { PostPageDispatchToProps, PostPageStateToProps } from 'src/containers/posts/post-page';
import LoadSpinner from 'src/components/load-spinner/load-spinner';
import Zoom from 'src/lib/zoom.js/zoom';
import 'highlight.js/styles/vs2015.css';

const $ = require('jquery');
const { DiscussionEmbed } = require('disqus-react');

const ShareItem = ({ onClick, fa, children }: { onClick: any, fa: string, children: string }) => (
    <div className="share-link" onClick={ onClick }>
        <div className="row">
            <div className="col-2"><i className={`fa fa-${fa}`}/></div>
            <div className="col-10">{ children }</div>
        </div>
        <Ink />
    </div>
);

class ShareModal extends React.Component<{ post: Post | null } & InjectedTranslateProps> {

    private static query(object: any): string {
        return (Object['entries'](object) as [string, string][]).map(pair => `${pair[0]}=${pair[1]}`).join('&');
    }

    constructor(props: { post: Post | null } & InjectedTranslateProps) {
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

const ShareModalT = translate()(ShareModal);

interface RouteParams {
    year: number;
    month: number;
    day: number;
    title: string;
}

type PostPageProps = PostPageStateToProps & PostPageDispatchToProps & RouteComponentProps<RouteParams> &
    InjectedTranslateProps;

interface PostPageState {
    entry: Post | null;
    notFound: boolean;
}

export default class PostPage extends React.Component<PostPageProps, PostPageState> {

    private zoomjs: Zoom;

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
            this.zoomjs = new Zoom();
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
                <div className="postPage" dangerouslySetInnerHTML={{ __html: this.props.content }}/>
            );
            if(this.state.entry) {
                disqusConfig = {
                    url: window.location.toString(),
                    identifier: this.state.entry!._id,
                    title: this.state.entry!.title,
                };
            }
        } else if(!this.state.notFound) {
            domContent = (
                <div className="postPage d-flex justify-content-center">
                    <LoadSpinner />
                </div>
            );
        } else {
            domContent = (
                <div className="postPage">
                    No existe esto pisha
                </div>
            );
        }

        const styles = window.document.body.clientWidth > 568 ? { top: 15, right: 40 } : { bottom: 45, right: 20 };

        return (
            <div>
                <div className="circle-button share"
                     style={{ ...styles }}
                     onClick={ () => $('#share-modal').modal('show') }>
                    <i className="fa fa-share"/>
                </div>

                { domContent }

                { disqusConfig && <DiscussionEmbed shortname={'personal-website-11'} config={disqusConfig} /> }

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
            this.props.changeTitle(postsMatching[0].title);
            this.props.loadPost(postsMatching[0]);
        } else if(postsMatching.length === 0) {
            setTimeout(() => this.setState({ notFound: true }));
            this.props.changeTitle('Post no encontrado');
        } else {
            console.error(postsMatching);
            throw new Error('More than one post matches this url');
        }
    }
}
