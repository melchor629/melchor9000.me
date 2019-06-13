import React from 'react';
import moment from 'moment';
import firebase from 'firebase/app';
import { RouteComponentProps } from 'react-router-dom';
import { Transition, Keyframes, Spring, animated } from 'react-spring/renderprops';
import { Helmet } from 'react-helmet';
import * as toast from '../../../lib/toast';
import render from '../../../lib/render-post-content';
import { PostEditorDispatchToProps, PostEditorStateToProps } from '../../../containers/admin/posts/editor';
import LoadSpinner from '../../load-spinner';
import { Post } from '../../../redux/posts/reducers';
import { AdminInput } from '../admin-input';
import { dateValidator, valueValidator } from '../../../lib/validators';

const speakingurl = require('speakingurl');

const LittleSpinner = (props: React.HTMLProps<HTMLDivElement> & { ref?: undefined }) => (
    <Keyframes
        native={ true }
        config={{ duration: 1000, easing: (t: number) => t }}
        wiggle={ async (next: any) => {
            while(true) {
                await next(Spring, {
                    from: { r: 0 },
                    to: { r: 2 * Math.PI }
                });
            }
        }}>
        { (vals: any) => (
            <animated.div style={{
                transform: vals.r.interpolate((x: number) => `rotateZ(${x}rad)`),
                display: 'inline-block',
                position: 'absolute',
                top: 5,
                right: 10
            }} {...props}>
                <i className="fas fa-spinner" />
            </animated.div>
        ) }
    </Keyframes>
);

interface PostEditorState {
    title: string;
    img: string;
    url: string;
    publishDate: moment.Moment;
    publishDateString: string;
    content: string;
    contentRendered: string | null;
    validImg: boolean;
    preview: boolean;
    loading: { img: boolean; content: boolean; };
    saving: boolean;
    original: Post | null;
}

type PostEditorProps = PostEditorStateToProps & PostEditorDispatchToProps & RouteComponentProps<{ id?: string }>;

export default class PostEditor extends React.Component<PostEditorProps, PostEditorState> {

    private contentRendererUnshifterTimer: NodeJS.Timer | null = null;
    private imageCheckerTimer: NodeJS.Timer | null = null;

    private static showError(message: string, error: any) {
        toast.error(
            <div>
                { message }<br />
                <span className="text-muted">{ error.toString() }</span>
            </div>
        );
    }

    constructor(props: PostEditorProps) {
        super(props);
        this.state = {
            title: '',
            img: '',
            url: '',
            publishDate: moment(new Date(Date.now() + 24 * 60 * 60 * 1000)),
            publishDateString: moment(new Date(Date.now() + 24 * 60 * 60 * 1000)).format('YYYY-MM-DDTHH:mm:ss'),
            content: '',
            contentRendered: '',
            validImg: true,
            preview: false,
            loading: { img: false, content: false },
            saving: false,
            original: null,
        };

        this.publishDateChanged = this.publishDateChanged.bind(this);
        this.contentChanged = this.contentChanged.bind(this);
        this.previewToggle = this.previewToggle.bind(this);
        this.titleChanged = this.titleChanged.bind(this);
        this.imgChanged = this.imgChanged.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        const setStateFromPost = (post: Post | any, _id: string) => {
            this.setState({
                title: post.title,
                img: post.img,
                url: post.url,
                publishDate: moment(post.date.toDate()),
                publishDateString: moment(post.date.toDate()).format('YYYY-MM-DDTHH:mm:ss'),
                loading: { img: false, content: true },
                original: { ...post, _id },
                saving: false,
            });
            firebase.storage()
                .ref(post.file)
                .getDownloadURL()
                .then(url => fetch(url))
                .then(res => res.text())
                .then(async content => {
                    this.setState({ content, loading: { ...this.state.loading, content: false } });
                    await this.renderContent();
                });
        };

        if(this.props.location.state && this.props.location.state.post) {
            const post: Post = this.props.location.state;
            setStateFromPost(post, post._id!);
        } else if(this.props.match.params.id) {
            this.setState({ saving: true });
            firebase.firestore().collection('posts').doc(this.props.match.params.id).get().then(obj => {
                setStateFromPost(obj.data(), this.props.match.params.id!);
            });
        }
    }

    componentDidUpdate(prevProps: PostEditorProps) {
        if(prevProps.saving && !this.props.saving) {
            this.setState({ saving: false });
            if(!this.props.errorSaving) {
                this.props.history.push('/admin/posts/');
            } else {
                PostEditor.showError('No se pudo subir los metadatos del post...', this.props.errorSaving);
                this.props.clearError();
                const pd = this.state.publishDate;
                firebase.storage()
                    .ref(`/posts/${pd.get('year')}-${pd.get('month')}-${pd.get('date')}-${this.state.url}.md`)
                    .delete()
                    .catch();
            }
        }
    }

    render() {
        const { title, img, url, publishDate, publishDateString, validImg, content, contentRendered,
                preview } = this.state;
        const { darkMode } = this.props;

        return (
            <div>

                <Helmet>
                    <title>{this.state.original !== null ? `Editing: ${title}` : `Creating new post: ${title}`}</title>
                </Helmet>

                <h1>Crear nueva entrada</h1>

                <form>
                    <AdminInput type="text"
                                id="title"
                                placeholder="Título"
                                value={ title }
                                required={ true }
                                onChange={ this.titleChanged }/>
                    <AdminInput type="datetime-local"
                                id="publishDate"
                                placeholder="Fecha de publicación"
                                min={ moment().format('YYYY-MM-DDTHH:mm:ss') }
                                value={ publishDateString }
                                required={ true }
                                validators={ [ dateValidator('YYYY-MM-DDTHH:mm:ss') ] }
                                onChange={ this.publishDateChanged } />
                    <AdminInput type="url"
                                id="url"
                                placeholder="URL"
                                disabled={ true }
                                value={ publishDate ? `${process.env.PUBLIC_URL}/posts/` +
                                    `${publishDate.utc().get('year')}/${publishDate.utc().get('month')}/` +
                                    `${publishDate.utc().get('date')}/${url}` : '' }
                                required={ true }
                                onChange={ () => null } />
                    <AdminInput type="url"
                                style={{ position: 'relative' }}
                                id="img"
                                placeholder="Imagen"
                                value={ img }
                                required={ true }
                                validators={ [ valueValidator(validImg) ] }
                                onChange={ this.imgChanged }>
                        { this.state.loading.img && <LittleSpinner /> }
                    </AdminInput>
                    <div className="form-group material" style={{ position: 'relative' }}>
                        <textarea className={ 'form-control' + (contentRendered ? '' : ' is-invalid') }
                                  style={{ height: 'calc(100vh - 466px)' }}
                                  value={ content }
                                  onChange={ this.contentChanged } />
                        { this.state.loading.content && <LittleSpinner /> }
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="btn btn-group">
                            <button className="btn btn-outline-primary" onClick={ this.previewToggle }
                                    disabled={ !(validImg &&
                                                !!contentRendered &&
                                                title.length > 0) }>
                                Vista previa
                            </button>
                            <button className="btn btn-outline-success"
                                    onClick={ this.save }
                                    disabled={ !(publishDate.isValid() &&
                                               validImg &&
                                               !!contentRendered &&
                                               title.length > 0) }>
                                Guardar
                            </button>
                        </div>
                    </div>
                </form>

                <Transition native={ true } from={{ val: 0 }} enter={{ val: 1 }} leave={{ val: 0 }} items={ preview }>
                    { toggle => ((vals: { val: number }) => !toggle ? null : (
                        <animated.div role="main" className="ml-sm-auto px-4" style={{
                            position: 'absolute',
                            overflowY: 'scroll',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: 'calc(100vh - 30px)',
                            backgroundColor: darkMode ? '#222' : 'white',
                            zIndex: 1,
                            transform: (vals.val as any).interpolate((x: number) => `translateX(${(1 - x) * 100}vw)`)
                        }}>
                            <div className="text-center">
                                <img src={ img } className="img-fluid" alt={ title } />
                            </div>

                            <div className="d-flex justify-content-end" style={{ position: 'sticky', top: 40 }}>
                                <div className="btn btn-group">
                                    <button className="btn btn-outline-primary" onClick={ this.previewToggle }>
                                        &times;
                                    </button>
                                </div>
                            </div>

                            <h1>{ title }</h1>
                            <p className="lead" dangerouslySetInnerHTML={{ __html: contentRendered || '<p />' }} />
                        </animated.div>
                    )) }
                </Transition>

                <Transition native={ true } from={{ val: 0 }} enter={{ val: 1 }} leave={{ val: 0 }}
                            items={ this.props.saving || this.state.saving }>
                    { toggle => ((vals: any) => !toggle ? null : (
                        <animated.div role="main" className="ml-sm-auto px-4" style={{
                            position: 'absolute',
                            overflowY: 'scroll',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: 'calc(100vh - 30px)',
                            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.55)',
                            zIndex: 1,
                            opacity: vals.val.interpolate((x: number) => `${x}`)
                        }}>
                            <LoadSpinner />
                        </animated.div>
                    )) }
                </Transition>
            </div>
        );
    }

    private titleChanged(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        this.setState({
            title: e.target.value,
            url: speakingurl(e.target.value, { lang: 'es' })
        });
    }

    private publishDateChanged(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        const date = moment(e.target.value, 'YYYY-MM-DDTHH:mm:ss', true);
        this.setState({
            publishDateString: e.target.value,
            publishDate: date,
        });
    }

    private imgChanged(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        this.setState({
            img: e.target.value,
            validImg: e.target.value.length === 0 ? false : this.state.validImg
        });

        if(this.imageCheckerTimer) {
            clearTimeout(this.imageCheckerTimer);
        }

        if(e.target.value.length > 0) {
            this.imageCheckerTimer = setTimeout(async () => {
                this.setState({ loading: { ...this.state.loading, img: true } });
                try {
                    const req = await fetch(this.state.img, { method: 'HEAD' });
                    this.setState({
                        validImg: req.ok && req.status === 200 &&
                                req.headers.get('Content-Type')!.indexOf('image') !== -1,
                        loading: { ...this.state.loading, img: false }
                    });
                } catch(e) {
                    PostEditor.showError('No se pudo saber si la imagen existe...', e);
                    this.setState({
                        loading: { ...this.state.loading, img: false }
                    });
                }
                this.imageCheckerTimer = null;
            }, 1000);
        }
    }

    private contentChanged(e: React.ChangeEvent<HTMLTextAreaElement>) {
        e.preventDefault();
        this.setState({
            content: e.target.value
        });

        if(this.contentRendererUnshifterTimer) {
            clearTimeout(this.contentRendererUnshifterTimer);
        }

        this.contentRendererUnshifterTimer = setTimeout(async () => {
            this.contentRendererUnshifterTimer = null;
            await this.renderContent();
        }, 300);
    }

    private previewToggle(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ preview: !this.state.preview });
    }

    private save(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ saving: true });
        const pd = this.state.publishDate;
        if(this.state.original) {
            firebase.storage()
                .ref(this.state.original.file)
                .putString(this.state.content, firebase.storage.StringFormat.RAW)
                .then(() => {
                    this.props.update({
                        date: firebase.firestore.Timestamp.fromDate(this.state.publishDate.toDate()),
                        file: this.state.original!.file,
                        img: this.state.img,
                        title: this.state.title,
                        url: this.state.url,
                        modifiedDate: firebase.firestore.Timestamp.fromDate(moment().toDate()),
                        _id: this.state.original!._id
                    });
                })
                .catch(error => {
                    PostEditor.showError('No se pudo subir el contenido del post...', error);
                    this.setState({ saving: false });
                });
        } else {
            firebase.storage()
                .ref(`/posts/${pd.get('year')}-${pd.get('month') + 1}-${pd.get('date')}-${this.state.url}.md`)
                .putString(this.state.content, firebase.storage.StringFormat.RAW)
                .then(() => {
                    this.props.save({
                        date: firebase.firestore.Timestamp.fromDate(this.state.publishDate.toDate()),
                        file: `/posts/${pd.get('year')}-${pd.get('month') + 1}-${pd.get('date')}-${this.state.url}.md`,
                        img: this.state.img,
                        title: this.state.title,
                        url: this.state.url,
                    });
                })
                .catch(error => {
                    PostEditor.showError('No se pudo subir el contenido del post...', error);
                    this.setState({ saving: false });
                });
        }
    }

    private async renderContent() {
        this.setState({ loading: { ...this.state.loading, content: true } });
        try {
            this.setState({
                contentRendered: await render(this.state.content, 'md'),
                loading: { ...this.state.loading, content: false }
            });
        } catch(e) {
            this.setState({
                contentRendered: null,
                loading: { ...this.state.loading, content: false }
            });
        }
    }

}