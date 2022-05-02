import { connect } from 'react-redux'
import { State } from '../../../redux/store'
import { insert, removeError, update } from '../../../redux/database/actions'
import ProjectEditorComponent from '../../../components/admin/projects/editor'
import type { ProjectInfo } from '../projects'
import { ID } from '../../../redux/database/state'

export interface ProjectEditorStateToProps {
  saving: boolean
  errorSaving: any | null
  darkMode: boolean
}

export interface ProjectEditorDispatchToProps {
  save: (project: ProjectInfo) => void
  update: (projectInfo: Partial<ProjectInfo> & { [ID]: string }) => void
  clearError: () => void
}

const mapStateToProps = (state: State): ProjectEditorStateToProps => ({
  saving: state.database.projects?.doing || false,
  errorSaving: state.database.projects?.error,
  darkMode: state.effects.darkMode,
})

const mapDispatchToProps = (dispatch: (...args: any) => void): ProjectEditorDispatchToProps => ({
  save: (project: ProjectInfo) => dispatch(insert('projects', project)),
  update: (project: Partial<ProjectInfo> & { [ID]: string }) => dispatch(update('projects', project)),
  clearError: () => dispatch(removeError('projects')),
})

export const ProjectEditor = connect(mapStateToProps, mapDispatchToProps)(ProjectEditorComponent)
