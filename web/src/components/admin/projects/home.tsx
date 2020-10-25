/* eslint-disable no-underscore-dangle */
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import * as toast from '../../../lib/toast'
import type { ProjectsHomeDispatchToProps, ProjectsHomeStateToProps } from '../../../containers/admin/projects/home'
import type { ProjectInfo } from '../../../containers/admin/projects'
import DeleteModal from '../delete-modal'

type ProjectsPageProps = ProjectsHomeStateToProps & ProjectsHomeDispatchToProps

interface PostsHomeState {
  projectToDelete: ProjectInfo | null
}

export default class PostsHome extends React.Component<ProjectsPageProps, PostsHomeState> {
  constructor(props: ProjectsPageProps) {
    super(props)
    this.state = { projectToDelete: null }
  }

  componentDidUpdate(prevProps: ProjectsPageProps) {
    const { deleting, errorDeleting, clearError } = this.props
    if (prevProps.deleting && !deleting) {
      if (errorDeleting) {
        toast.error(
          <div>
            No se pudo borrar los metadatos del post...
            <br />
            <span className="text-muted">{errorDeleting.toString()}</span>
          </div>,
        )
        clearError()
      }
    }
  }

  private deleteProject() {
    const { delete: deleteProject } = this.props
    const { projectToDelete } = this.state
    deleteProject(projectToDelete!)
  }

  private selectForDeleting(e: React.MouseEvent<HTMLButtonElement>, project: ProjectInfo) {
    e.preventDefault()
    this.setState({ projectToDelete: project })
  }

  render() {
    const { projectToDelete } = this.state
    const { darkMode, projects } = this.props
    return (
      <div>

        <Helmet>
          <title>Projects - Admin</title>
        </Helmet>

        <div className="row align-items-center">
          <div className="col"><h1>Projects</h1></div>
          <div className="col-auto">
            <Link to="/admin/projects/create" className="btn btn-sm btn-outline-success mb-2">
              <i className="fas fa-plus" />
            </Link>
          </div>
        </div>
        <table className={`table ${darkMode ? 'table-dark' : 'table-light'} table-hover`}>
          <thead className={darkMode ? 'thead-dark' : 'thead-light'}>
            <tr>
              <th>Título</th>
              <th>Technologías</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="admin-list-row">
                <td>{ project.title }</td>
                <td>{ project.technologies.join(', ') }</td>
                <td className="admin-list-row-actions">
                  { project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="fab fa-github" />
                  </a>
                  ) }
                  &nbsp;
                  <Link
                    to={`/admin/projects/edit/${project._id}`}
                    className="btn btn-sm btn-outline-warning"
                  >
                    <i className="fas fa-pencil-alt" />
                  </Link>
                  &nbsp;
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => this.selectForDeleting(e, project)}
                  >
                    <i className="fas fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <DeleteModal
          item={projectToDelete}
          onClose={() => this.setState({ projectToDelete: null })}
          onDelete={() => this.deleteProject()}
        />
      </div>
    )
  }
}
