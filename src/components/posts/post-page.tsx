import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';
import { WithTranslation } from 'react-i18next';
import $ from 'jquery';
import { Post } from '../../redux/posts/reducers';
import { PostPageDispatchToProps, PostPageStateToProps } from '../../containers/posts/post-page';
import LoadSpinner from '../load-spinner/load-spinner';
import Zoom from '../../lib/zoom.js/zoom';
import DisqusWrapper from '../posts/disqus-wrapper';
import { PostPageContent } from './post-page-content';
import { ShareModal } from './share-modal';
import 'highlight.js/styles/vs2015.css';

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
        (requestAnimationFrame || setTimeout)(() => {
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
                    <i className="fas fa-share"/>
                </div>

                <PostPageContent entry={ this.state.entry }>{ domContent }</PostPageContent>
                <DisqusWrapper shortName={'personal-website-11'} config={disqusConfig} />
                { this.state.entry && <ShareModal post={ this.state.entry } /> }
            </div>
        );
    }

    private findPost() {
        if(this.props.posts) {
            const { year, month, day, title } = this.props.match.params;
            const postsMatching = this.props.posts!
                .filter(post => post.date.toDate().getUTCFullYear() === Number(year))
                .filter(post => post.date.toDate().getUTCMonth() === Number(month) - 1)
                .filter(post => post.date.toDate().getUTCDate() === Number(day))
                .filter(post => post.url === title);
            if(postsMatching.length === 1) {
                this.setState({ entry: postsMatching[0] });
                this.props.loadPost(postsMatching[0]);
            } else if(postsMatching.length === 0) {
                this.setState({ notFound: true });
            } else {
                console.error(postsMatching);
                throw new Error('More than one post matches this url');
            }
        }
    }
}
