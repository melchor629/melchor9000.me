import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import * as toast from '../../../lib/toast'
import type { ProjectsHomeDispatchToProps, ProjectsHomeStateToProps } from '../../../containers/admin/projects/home'
import type { ProjectInfo } from '../../../containers/admin/projects'
import DeleteModal from '../delete-modal'
import ProjectRow from './project-row'
import { ID } from '../../../redux/database/state'

type ProjectsPageProps = ProjectsHomeStateToProps & ProjectsHomeDispatchToProps

const ProjectsHome = ({
  clearError,
  darkMode,
  deleting,
  delete: deleteProject,
  errorDeleting,
  projects,
}: ProjectsPageProps) => {
  const [projectToDelete, setProjectToDelete] = useState<ProjectInfo | null>(null)

  useEffect(() => {
    if (!deleting && errorDeleting) {
      toast.error(
        <div>
          No se pudo borrar los metadatos del post...
          <br />
          <span className="text-muted">{errorDeleting.toString()}</span>
        </div>,
      )
      clearError()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleting])

  const effectivelyDeleteProject = useCallback(() => {
    if (!projectToDelete) {
      return
    }

    deleteProject(projectToDelete)
  }, [deleteProject, projectToDelete])

  return (
    <div>

      <Helmet>
        <title>Projects - Admin</title>
      </Helmet>

      <div className="row align-items-center">
        <div className="col"><h1>Projects</h1></div>
        <div className="col-auto">
          <Link to="create" className="btn btn-sm btn-outline-success mb-2">
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
            <ProjectRow
              key={project[ID]}
              project={project}
              setProjectToDelete={setProjectToDelete}
            />
          ))}
        </tbody>
      </table>

      <DeleteModal
        item={projectToDelete}
        onClose={useCallback(() => setProjectToDelete(null), [])}
        onDelete={effectivelyDeleteProject}
      />
    </div>
  )
}

export default ProjectsHome
