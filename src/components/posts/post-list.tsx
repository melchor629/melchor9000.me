import React from 'react';
import $ from 'jquery';
import { PostListDispatchToProps, PostListStateToPros } from '../../containers/posts/post-list';
import LoadSpinner from '../load-spinner';
import Entry from './post-entry';

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
        if(this.props.posts) {
            let entries = this.props.posts.map((entry, i) => <Entry entry={entry} key={i}/>);
            return (
                <div className="mainPage d-flex flex-wrap">
                    { entries }
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
                let abajoPos = window.scrollY + $(window).height()!;
                if(abajoPos > $('.mainPage').height()! - 70) {
                    this.props.showMore(6);
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