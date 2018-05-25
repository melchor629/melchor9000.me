import * as React from 'react';
import { toast } from 'react-toastify';
import LoadSpinner from './load-spinner/index';
import { ProjectDispatchToProps, ProjectStateToProps } from '../containers/projects';

interface ProjectInfo {
    title: string;
    repo: string;
    demo: string;
    web: string;
    image?: string;
    technologies: string[];
    description: string;
}

const Project = ({ project, darkMode }: { project: ProjectInfo, darkMode: boolean }) => (
    <div className={ `card ${darkMode ? 'bg-dark' : 'bg-light'}` }>
        { project.image ? <img className="card-img-top" src={ project.image } alt={ project.title } /> : null }
        <div className="card-body">
            <h5 className="card-title">{ project.title }</h5>
            <h6 className="card-subtitle mb-2 text-muted">{ project.technologies.join(', ') }</h6>
            <p className="card-text" dangerouslySetInnerHTML={{ __html: project.description }} />
            { project.repo ?
                <a href={ project.repo } className="card-link" target="_blank" rel="nofollow">Repositorio</a> : null }
            { project.demo ?
                <a href={ project.demo } className="card-link" target="_blank" rel="nofollow">Demo</a> : null }
            { project.web ?
                <a href={ project.web } className="card-link" target="_blank" rel="nofollow">Web</a> : null }
        </div>
    </div>
);

export default class Projects extends React.Component<ProjectStateToProps & ProjectDispatchToProps> {
    componentDidMount() {
        this.props.subscribe();
        this.props.changeTitle('Projects');
    }

    componentWillUnmount() {
        this.props.unsubscribe();
    }

    componentDidUpdate(nextProps: ProjectStateToProps & ProjectDispatchToProps): void {
        if(nextProps.subscriptionError) {
            toast.error(() => (
                <div>
                    No pudimos cargar los datos. <br/>
                    <span className="text-muted">{ nextProps.subscriptionError.message }</span>
                </div>
            ));
            this.props.removeError();
        }
    }

    render() {
        const { projects, darkMode } = this.props;
        let projectsDiv: any[] | null = null;
        if(projects) {
            projectsDiv = [];
            projects.forEach((project, i) =>
                projectsDiv!.push(<Project project={ project } key={ i } darkMode={ darkMode } />));
        }
        return (
            <div>
                <div className="page-header">
                    <h1>Proyectos <small>mios o en los que he participado que tienen cierta importancia</small></h1>
                    <p className="lead">
                        Podreis ver todo tipo de proyectos separados por categorias de los cuales
                        podreis probar si ningún problema, siempre y cuando tengáis todo lo necesario
                    </p>
                </div>

                { projects ? (
                    <div className="card-columns">{ projectsDiv }</div>
                ) :
                    <LoadSpinner />
                }
            </div>
        );
    }
}
