import { MouseEvent, useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { ProjectInfo } from '../../../containers/admin/projects'
import { ID } from '../../../redux/database/state'

interface ProjectRowProps {
  project: ProjectInfo
  setProjectToDelete: (project: ProjectInfo) => void
}

const ProjectRow = ({ project, setProjectToDelete }: ProjectRowProps) => {
  const selectForDeleting = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setProjectToDelete(project)
  }, [project, setProjectToDelete])

  return (
    <tr className="admin-list-row">
      <td>{project.title}</td>
      <td>{(project.technologies || []).join(', ')}</td>
      <td className="admin-list-row-actions">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm"
          >
            <i className="fab fa-github" />
          </a>
        )}
        &nbsp;
        <Link
          to={`edit/${project[ID]}`}
          className="btn btn-sm btn-outline-warning"
        >
          <i className="fas fa-pencil-alt" />
        </Link>
        &nbsp;
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={selectForDeleting}
        >
          <i className="fas fa-trash" />
        </button>
      </td>
    </tr>
  )
}

export default ProjectRow
