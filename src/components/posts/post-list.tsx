import * as React from 'react';
import { PostListDispatchToProps, PostListStateToPros } from 'src/containers/posts/post-list';
import LoadSpinner from 'src/components/load-spinner';
import Entry from './post-entry';

const $ = require('jquery');

type PostListProps = PostListStateToPros & PostListDispatchToProps;

export default class PostList extends React.Component<PostListProps> {

    constructor(props: PostListProps) {
        super(props);
        this.windowScrolled = this.windowScrolled.bind(this);
        this.windowResized = this.windowResized.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            window.scrollTo(window.scrollX, this.props.scroll);
        });
        this.props.changeTitle('Posts');

        window.addEventListener('scroll', this.windowScrolled, { passive: true });
        window.addEventListener('resize', this.windowResized, { passive: true });

        if($(window).width() >= 992) {
            requestAnimationFrame(() => this.windowScrolled());
        }
    }

    componentWillUnmount() {
        this.props.saveScroll(window.scrollY);

        window.removeEventListener('scroll', this.windowScrolled);
        window.removeEventListener('resize', this.windowResized);
    }

    componentDidUpdate(prevProps: PostListProps) {
        if(prevProps.posts === null && this.props.posts !== null) {
            requestAnimationFrame(() => this.windowScrolled());
        }
    }

    render() {
        let cols = $(window).width() >= 992 ? 3 : ($(window).width() >= 768 ? 2 : 1);
        if(this.props.posts) {
            let entries = this.props.posts.map((entry, i) => <Entry entry={entry} key={i}/>);
            let entries1 = entries.filter((v, i) => i % cols === 0);
            let entries2 = entries.filter((v, i) => i % cols === 1);
            let entries3 = entries.filter((v, i) => i % cols === 2);
            return (
                <div className="mainPage row">
                    <div className="col-md-6 col-lg-4">{entries1}</div>
                    {cols >= 2 && <div className="col-md-6 col-lg-4">{entries2}</div>}
                    {cols >= 3 && <div className="col-md-6 col-lg-4">{entries3}</div>}
                </div>
            );
        } else {
            return (
                <div className="mainPage row justify-content-center">
                    <LoadSpinner />
                </div>
            );
        }
    }

    private windowScrolled() {
        if(this.props.posts) {
            if(this.props.posts.length < this.props.postsCount) {
                let abajoPos = window.scrollY + $(window).height();
                if(abajoPos > $('.mainPage').height() + 70) {
                    this.props.showMore();
                    if(this.props.posts!.length + 3 >= this.props.postsCount) {
                        window.removeEventListener('scroll', this.windowScrolled);
                    }
                }
            }
        }
    }

    private windowResized() {
        this.forceUpdate();
    }
}