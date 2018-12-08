import * as React from 'react';
import { Link } from 'react-router-dom';
import * as toast from '../../../lib/toast';
import { ProjectsHomeDispatchToProps, ProjectsHomeStateToProps } from '../../../containers/admin/projects/home';
import { ProjectInfo } from '../../../containers/admin/projects';
import DeleteModal from '../delete-modal';

type ProjectsPageProps = ProjectsHomeStateToProps & ProjectsHomeDispatchToProps;

export default class PostsHome extends React.Component<ProjectsPageProps, { projectToDelete: ProjectInfo | null }> {

    constructor(props: ProjectsPageProps) {
        super(props);
        this.state = {
            projectToDelete: null,
        };
    }

    componentDidMount() {
        this.props.changeTitle('Projects - Admin');
    }

    componentDidUpdate(prevProps: ProjectsPageProps) {
        if(prevProps.deleting && !this.props.deleting) {
            if(this.props.errorDeleting) {
                toast.error(
                    <div>
                        No se pudo borrar los metadatos del post...<br />
                        <span className="text-muted">{ this.props.errorDeleting.toString() }</span>
                    </div>
                );
                this.props.clearError();
            }
        }
    }

    render() {
        return (
            <div>
                <div className="row align-items-center">
                    <div className="col"><h1>Projects</h1></div>
                    <div className="col-auto">
                        <Link to="/admin/projects/create" className="btn btn-sm btn-outline-success mb-2">
                            <i className="fa fa-plus" />
                        </Link>
                    </div>
                </div>
                <table className="table table-light table-hover">
                    <thead className="thead-light">
                    <tr>
                        <th>Título</th>
                        <th>Technologías</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    { this.props.projects.map(project => (
                        <tr key={ project._id } className="admin-list-row">
                            <td>{ project.title }</td>
                            <td>{ project.technologies.join(', ') }</td>
                            <td className="admin-list-row-actions">
                                { project.repo && <a href={ project.repo } target="_blank" rel="noreferrer"
                                                     className="btn btn-outline-primary btn-sm">
                                    <i className="fa fa-github" />
                                </a> }
                                &nbsp;
                                <Link to={ `/admin/projects/edit/${project._id}` }
                                      className="btn btn-sm btn-outline-warning">
                                    <i className="fa fa-pencil" />
                                </Link>
                                &nbsp;
                                <button className="btn btn-sm btn-outline-danger"
                                        onClick={ (e) => this.selectForDeleting(e, project) }>
                                    <i className="fa fa-trash" />
                                </button>
                            </td>
                        </tr>
                    )) }
                    </tbody>
                </table>

                <DeleteModal item={ this.state.projectToDelete }
                             onClose={ () => this.setState({ projectToDelete: null }) }
                             onDelete={ () => this.deleteProject() } />
            </div>
        );
    }

    private selectForDeleting(e: React.MouseEvent<HTMLButtonElement>, project: ProjectInfo) {
        e.preventDefault();
        this.setState({ projectToDelete: project });
    }

    private deleteProject() {
        this.props.delete(this.state.projectToDelete!);
    }

}