import * as React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import * as toast from '../../../lib/toast';
import { PostsHomeDispatchToProps, PostsHomeStateToProps } from '../../../containers/admin/posts/home';
import { Post } from '../../../redux/posts/reducers';
import DeleteModal from '../delete-modal';

type PostsPageProps = PostsHomeStateToProps & PostsHomeDispatchToProps;

export default class PostsHome extends React.Component<PostsPageProps, { postToDelete: Post | null }> {

    constructor(props: PostsPageProps) {
        super(props);
        this.state = {
            postToDelete: null,
        };
    }

    componentDidMount() {
        this.props.changeTitle('Posts - Admin');
    }

    componentDidUpdate(prevProps: PostsPageProps) {
        if(prevProps.deleting && !this.props.deleting) {
            if(this.props.errorSaving) {
                toast.error(
                    <div>
                        No se pudo borrar los metadatos del post...<br />
                        <span className="text-muted">{ this.props.errorSaving.toString() }</span>
                    </div>
                );
                this.props.clearError();
            }
        }
    }

    render() {
        const postUrl = (post: Post) => {
            const date = post.date.toDate();
            return `/blog/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${post.url}`;
        };

        return (
            <div>
                <div className="row align-items-center">
                    <div className="col"><h1>Posts</h1></div>
                    <div className="col-auto">
                        <Link to="/admin/posts/create" className="btn btn-sm btn-outline-success mb-2">
                            <i className="fa fa-plus" />
                        </Link>
                    </div>
                </div>
                <table className="table table-light table-hover">
                    <thead className="thead-light">
                    <tr>
                        <th>Título</th>
                        <th>Fecha de publicación</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    { this.props.posts && this.props.posts.map(post => (
                        <tr key={ post._id } className="admin-list-row">
                            <td><Link to={ postUrl(post) }>{ post.title }</Link></td>
                            <td>{ post.date.toDate().toLocaleString() }</td>
                            <td className="admin-list-row-actions">
                                <Link to={ `/admin/posts/edit/${post._id}` } className="btn btn-sm btn-outline-warning">
                                    <i className="fa fa-pencil" />
                                </Link>
                                &nbsp;
                                <button className="btn btn-sm btn-outline-danger"
                                        onClick={ (e) => this.selectForDeleting(e, post) }>
                                    <i className="fa fa-trash" />
                                </button>
                            </td>
                        </tr>
                    )) }
                    </tbody>
                </table>

                <DeleteModal item={ this.state.postToDelete }
                             onClose={ () => this.setState({ postToDelete: null }) }
                             onDelete={ () => this.deletePost() } />
            </div>
        );
    }

    private selectForDeleting(e: React.MouseEvent<HTMLButtonElement>, post: Post) {
        e.preventDefault();
        this.setState({ postToDelete: post });
    }

    private deletePost() {
        const post = this.state.postToDelete!;

        firebase.storage()
            .ref(post.file)
            .delete()
            .then(() => {
                this.props.delete(post);
            })
            .catch(error => {
                toast.error(
                    <div>
                        No se pudo borrar el contenido del post<br />
                        <span className="text-muted">{ error.toString() }</span>
                    </div>
                );
            });
    }

}