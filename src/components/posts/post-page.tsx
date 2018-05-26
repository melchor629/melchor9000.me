import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { default as Ink } from 'react-ink';
import { Post } from '../../redux/posts/reducers';
import { PostPageDispatchToProps, PostPageStateToProps } from '../../containers/posts/post-page';
import LoadSpinner from '../load-spinner/load-spinner';
import Zoom from '../../lib/zoom.js/zoom';
import 'highlight.js/styles/vs2015.css';

const $ = require('jquery');

class ShareModal extends React.Component<{ post: Post | null }> {

    private static query(object: any): string {
        return (Object['entries'](object) as [string, string][]).map(pair => `${pair[0]}=${pair[1]}`).join('&');
    }

    constructor(props: { post: Post }) {
        super(props);
        this.telegramButtonPressed = this.telegramButtonPressed.bind(this);
        this.whatsappButtonPressed = this.whatsappButtonPressed.bind(this);
        this.twitterButtonPressed = this.twitterButtonPressed.bind(this);
        this.emailButtonPressed = this.emailButtonPressed.bind(this);
    }

    render() {
        return (
            <div className="modal share-modal fade" id="share-modal" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Compartir entrada</h2>
                        </div>
                        <div className="modal-body">
                            <div className="share-link" id="share-tw" onClick={this.twitterButtonPressed}>
                                <div className="row">
                                    <div className="col-2"><i className="fa fa-twitter"/></div>
                                    <div className="col-10">Twitter</div>
                                </div>
                                <Ink />
                            </div>

                            <div className="share-link" id="share-tg" onClick={this.telegramButtonPressed}>
                                <div className="row">
                                    <div className="col-2"><i className="fa fa-telegram"/></div>
                                    <div className="col-10">Telegram</div>
                                </div>
                                <Ink />
                            </div>

                            { /ipad|iphone|ipod|android/.test(navigator.userAgent.toLowerCase()) ?
                            <div className="share-link" id="share-wa" onClick={this.whatsappButtonPressed}>
                                <div className="row">
                                    <div className="col-2"><i className="fa fa-whatsapp"/></div>
                                    <div className="col-10">WhatsApp</div>
                                </div>
                                <Ink />
                            </div> : null
                            }

                            <div className="share-link" id="share-email" onClick={this.emailButtonPressed}>
                                <div className="row">
                                    <div className="col-2"><i className="fa fa-envelope"/></div>
                                    <div className="col-10">Email</div>
                                </div>
                                <Ink />
                            </div>
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
        window.open(`tg://msg_url?url=${encodeURIComponent(window.location.toString())}`);
    }

    private whatsappButtonPressed() {
        const post = this.props.post!;
        window.open(`whatsapp://send?text=${encodeURIComponent(post.title + ': ' + window.location)}`);
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

}

interface RouteParams {
    year: number;
    month: number;
    day: number;
    title: string;
}

type PostPageProps = PostPageStateToProps & PostPageDispatchToProps & RouteComponentProps<RouteParams>;

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
        let domContent;
        if(this.props.content) {
            domContent = (
                <div className="postPage" dangerouslySetInnerHTML={{ __html: this.props.content }}/>
            );
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

                <ShareModal post={ this.state.entry } />
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
