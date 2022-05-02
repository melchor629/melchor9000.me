import { connect } from 'react-redux'
import { State } from '../../../redux/store'
import { remove, removeError } from '../../../redux/database/actions'
import ProjectsHomeComponent from '../../../components/admin/projects/home'
import type { ProjectInfo } from '../projects'

export interface ProjectsHomeStateToProps {
  projects: ProjectInfo[]
  deleting: boolean
  errorDeleting: any | null
  darkMode: boolean
}

export interface ProjectsHomeDispatchToProps {
  delete: (post: ProjectInfo) => void
  clearError: () => void
}

const mapStateToProps = (state: State): ProjectsHomeStateToProps => ({
  projects: ((state.database.projects?.snapshot || []) as ProjectInfo[])
    .sort((a, b) => a.title.localeCompare(b.title)),
  deleting: state.database.posts?.doing ?? false,
  errorDeleting: state.database.posts?.error,
  darkMode: state.effects.darkMode,
})

const mapDispatchToProps = (dispatch: any): ProjectsHomeDispatchToProps => ({
  delete: (post: ProjectInfo) => dispatch(remove('projects', post)),
  clearError: () => dispatch(removeError('projects')),
})

export const ProjectsHome = connect(mapStateToProps, mapDispatchToProps)(ProjectsHomeComponent)
