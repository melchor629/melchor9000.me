import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as firebase from 'firebase';
import { Transition, animated } from 'react-spring';
import * as toast from '../../../lib/toast';
import LoadSpinner from '../../load-spinner';
import Project from '../../projects/project';
import { ProjectEditorStateToProps, ProjectEditorDispatchToProps } from '../../../containers/admin/projects/editor';
import { ProjectInfo } from '../../../containers/admin/projects';
import {
    urlOrLocalValidator,
    urlValidator,
    valueValidator,
} from '../../../lib/validators';
import { AdminInput, AdminBigInput } from '../admin-input';

type ProjectEditorProps = ProjectEditorStateToProps & ProjectEditorDispatchToProps &
    RouteComponentProps<{ id?: string }>;

interface ProjectEditorState {
    title: string;
    description: string;
    intlDescription: [string, string][];
    repo: string;
    demo: string;
    web: string;
    image: string;
    technologies: string[];
    preview: boolean;
    original: ProjectInfo | null;
    exists: { [x: string]: boolean };
    checking: { [x: string]: boolean };
}

export default class ProjectEditor extends React.Component<ProjectEditorProps, ProjectEditorState> {

    private urlFieldChangedTimers: { [x: string]: NodeJS.Timer | null } = {};

    constructor(props: ProjectEditorProps) {
        super(props);
        this.state = {
            title: '',
            description: '',
            intlDescription: [],
            repo: '',
            demo: '',
            web: '',
            image: '',
            technologies: [ '' ],
            preview: false,
            original: null,
            exists: {},
            checking: {},
        };

        this.changeLangDescription = this.changeLangDescription.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
        this.removeDescription = this.removeDescription.bind(this);
        this.removeTechnology = this.removeTechnology.bind(this);
        this.addDescription = this.addDescription.bind(this);
        this.previewToggle = this.previewToggle.bind(this);
        this.addTechnology = this.addTechnology.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        if(this.props.match.params.id) {
            firebase.firestore().collection('projects').doc(this.props.match.params.id).get().then(obj => {
                const project = obj.data() as ProjectInfo;
                this.setState({
                    original: { ...project, _id: obj.id },
                    title: project.title,
                    description: project.description,
                    repo: project.repo || '',
                    demo: project.demo || '',
                    web: project.web || '',
                    image: project.image || '',
                    technologies: project.technologies,
                    intlDescription: (project.intlDescription && Object.keys(project.intlDescription)
                        .map(key => [ key, project.intlDescription![key] ] as [string, string])) || []
                });
            });
        }
    }

    componentDidUpdate(prevProps: ProjectEditorProps) {
        if(prevProps.saving && !this.props.saving) {
            if(!this.props.errorSaving) {
                this.props.history.push('/admin/projects/');
            } else {
                toast.error('No se pudo añadir el nuevo proyecto...' + this.props.errorSaving.message);
                this.props.clearError();
            }
        }
    }

    render() {
        const {
            title, description, repo, demo, web, image, technologies, preview, exists, intlDescription
        } = this.state;

        return (
            <div>
                <h1>Añadir un nuevo proyecto</h1>

                <form>
                    <AdminInput type="text"
                                id="title"
                                placeholder="Nombre"
                                value={ title }
                                required={ true }
                                onChange={ e => this.setState({ title: e.target.value }) } />
                    <AdminBigInput type="text"
                                   id="description"
                                   placeholder="Descripción"
                                   value={ description }
                                   required={ true }
                                   onChange={ e => this.setState({ description: e.target.value }) } />
                    <AdminInput type="url"
                                id="repo"
                                placeholder="Repositorio"
                                value={ repo }
                                validators={ [ urlValidator ] }
                                onChangeAlt={ (e, v, i) => this.urlFieldChanged(e, 'repo', v, i) } />
                    <AdminInput type="url"
                                id="demo"
                                placeholder="Web de demostración"
                                value={ demo }
                                validators={ [ urlValidator ] }
                                onChangeAlt={ (e, v, i) => this.urlFieldChanged(e, 'demo', v, i) } />
                    <AdminInput type="url"
                                id="web"
                                placeholder="Web"
                                value={ web }
                                validators={ [ urlValidator ] }
                                onChangeAlt={ (e, v, i) => this.urlFieldChanged(e, 'web', v, i) } />
                    <AdminInput type="url"
                                id="image"
                                placeholder="Imagen"
                                value={ image }
                                validators={ [ urlOrLocalValidator, valueValidator(exists.image) ] }
                                onChangeAlt={ (e, v, i) => this.urlFieldChanged(e, 'image', v, i, 'image') } />
                    <div className="row align-items-end mb-2">
                        <div className="col-auto">Traducciones</div>
                        <div className="col" />
                        <div className="col-auto">
                            <button className="btn btn-sm btn-outline-primary" onClick={ this.addDescription }>
                                +
                            </button>
                        </div>
                    </div>
                    { intlDescription.map((pair, i) => (
                        <div className="row" key={ i }>
                            <div className="col-1">
                                <AdminInput type="text"
                                            id={ `lang-${pair[0]}` }
                                            placeholder="Lang"
                                            required={ true }
                                            onChange={ e => this.changeLangDescription(e, i) }
                                            value={ pair[0] } />
                            </div>
                            <div className="col">
                                <AdminBigInput type="text"
                                               id="description"
                                               value={ pair[1] }
                                               required={ true }
                                               onChange={ e => this.changeDescription(e, i) } />
                            </div>
                            <div className="col-auto d-flex align-items-center pl-0">
                                <button className="btn btn-sm btn-outline-warning"
                                        onClick={ e => this.removeDescription(e, i) }>-</button>
                            </div>
                        </div>
                    )) }
                    <div className="row align-items-end mb-2">
                        <div className="col-auto">Tecnologías</div>
                        <div className="col" />
                        <div className="col-auto">
                            <button className="btn btn-sm btn-outline-primary" onClick={ this.addTechnology }>+</button>
                        </div>
                    </div>
                    { technologies.map((value, i) => (
                        <div className="row" key={ i }>
                            <div className="col">
                                <AdminInput type="text"
                                            id={ `technology-${i}` }
                                            placeholder={ `Tecnología ${i}` }
                                            value={ value }
                                            required={ true }
                                            onChange={ e => this.setState({
                                                technologies: [
                                                    ...technologies.slice(0, i),
                                                    e.target.value,
                                                    ...technologies.slice(i + 1)
                                                ]
                                            }) } />
                            </div>
                            { i > 0 && <div className="col-auto d-flex align-items-center pl-0"
                                            style={{ paddingBottom: '1em' }}>
                                <button className="btn btn-sm btn-outline-warning"
                                        onClick={ e => this.removeTechnology(e, i) }>-</button>
                            </div> }
                        </div>
                    )) }

                    <div className="d-flex justify-content-end">
                        <div className="btn btn-group">
                            <button className="btn btn-outline-primary" onClick={ this.previewToggle }>
                                Vista previa
                            </button>
                            <button className="btn btn-outline-success"
                                    onClick={ this.save }>
                                Guardar
                            </button>
                        </div>
                    </div>
                </form>

                <Transition native={ true } from={{ val: 0 }} enter={{ val: 1 }} leave={{ val: 0 }} items={ preview }>
                    { toggle => ((vals: any) => toggle && (
                        <animated.div className="ml-sm-auto px-4" style={{
                            position: 'fixed',
                            top: 'calc(40px + 10px)',
                            right: 0,
                            zIndex: 1,
                            width: '300px',
                            maxHeight: 'calc(100vh - 40px - 10px - 30px)',
                            overflowY: 'scroll',
                            transform: vals.val.interpolate((x: number) => `translateX(${(1 - x) * 300}px)`)
                        }}>
                            <Project project={ this.getProject() as ProjectInfo } darkMode={ false } />
                        </animated.div>
                    )) }
                </Transition>

                <Transition native={ true } from={{ val: 0 }} enter={{ val: 1 }} leave={{ val: 0 }}
                            items={ this.props.saving }>
                    { toggle => ((vals: any) =>  toggle && (
                        <animated.div role="main" className="ml-sm-auto px-4" style={{
                            position: 'absolute',
                            overflowY: 'scroll',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: 'calc(100vh - 30px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.55)',
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

    private addTechnology(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({
            technologies: [
                ...this.state.technologies,
                ''
            ]
        });
    }

    private removeTechnology(e: React.MouseEvent<HTMLButtonElement>, i: number) {
        e.preventDefault();
        this.setState({
            technologies: [
                ...this.state.technologies.slice(0, i),
                ...this.state.technologies.slice(i + 1)
            ]
        });
    }

    private urlFieldChanged<K extends keyof ProjectEditorState>(e: React.ChangeEvent<HTMLInputElement>,
                                                                a: K, value: string, valid: boolean, type?: string) {
        e.preventDefault();
        this.setState({
            [a]: value
        } as any);

        if((valid || !this.state.exists[value]) && type) {
            if(this.urlFieldChangedTimers[a] !== null) {
                clearTimeout(this.urlFieldChangedTimers[a]!);
            }

            this.urlFieldChangedTimers[a] = setTimeout(async () => {
                this.setState({ checking: { ...this.state.checking, [a]: true } });
                try {
                    const res = await fetch(value, { method: 'HEAD' });
                    this.setState({
                        exists: {
                            ...this.state.exists,
                            [a]: res.ok && res.status === 200 && res.headers.get('Content-Type')!.indexOf(type) !== -1
                        },
                        checking: { ...this.state.checking, [a]: false }
                    });
                } catch(e) {
                    toast.error(e.message);
                    this.setState({
                        exists: {
                            ...this.state.exists,
                            [a]: false
                        },
                        checking: { ...this.state.checking, [a]: false }
                    });
                }
            }, 300);
        }
    }

    private previewToggle(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({ preview: !this.state.preview });
    }

    private addDescription(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        this.setState({
            intlDescription: [
                ...this.state.intlDescription,
                [ '', this.state.description ]
            ]
        });
    }

    private changeDescription(e: React.ChangeEvent<HTMLTextAreaElement>, i: number) {
        this.setState({
            intlDescription: [
                ...this.state.intlDescription.slice(0, i),
                [ this.state.intlDescription[i][0], e.currentTarget.value ],
                ...this.state.intlDescription.slice(i + 1),
            ]
        });
    }

    private removeDescription(e: React.MouseEvent<HTMLButtonElement>, i: number) {
        e.preventDefault();
        this.setState({
            intlDescription: [
                ...this.state.intlDescription.slice(0, i),
                ...this.state.intlDescription.slice(i + 1),
            ]
        });
    }

    private changeLangDescription(e: React.ChangeEvent<HTMLInputElement>, i: number) {
        this.setState({
            intlDescription: [
                ...this.state.intlDescription.slice(0, i),
                [ e.currentTarget.value.toLocaleLowerCase(), this.state.intlDescription[i][1] ],
                ...this.state.intlDescription.slice(i + 1),
            ]
        });
    }

    private save(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if(this.state.original) {
            this.props.update(this.getProject());
        } else {
            this.props.save(this.getProject());
        }
    }

    private getProject() {
        let project: Partial<ProjectInfo> = {
            title: this.state.title,
            repo: this.state.repo,
            technologies: this.state.technologies,
            description: this.state.description,
        };

        if(this.state.image.length > 0) {
            project.image = this.state.image;
        }

        if(this.state.demo.length > 0) {
            project.demo = this.state.demo;
        }

        if(this.state.web.length > 0) {
            project.web = this.state.web;
        }

        if(this.state.original) {
            project._id = this.state.original._id;
        }

        if(this.state.intlDescription.length > 0) {
            project.intlDescription = this.state.intlDescription
                .map((pair) => ({ [pair[0]]: pair[1] }))
                .reduce((r, i) => ({ ...r, ...i }), {});
        }

        return project;
    }

}