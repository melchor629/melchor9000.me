import { connect } from 'react-redux'
import { State } from '../../../redux/reducers'
import { insert, removeError, update } from '../../../redux/database/actions'
import ProjectEditorComponent from '../../../components/admin/projects/editor'
import { ProjectInfo } from '../projects'

export interface ProjectEditorStateToProps {
    saving: boolean
    errorSaving: any | null
    darkMode: boolean
}

export interface ProjectEditorDispatchToProps {
    save: (project: Partial<ProjectInfo>) => void
    update: (projectInfo: Partial<ProjectInfo>) => void
    clearError: () => void
}

const mapStateToProps = (state: State): ProjectEditorStateToProps => ({
    saving: state.database.doing.projects || false,
    errorSaving: state.database.errors.projects,
    darkMode: state.effects.darkMode,
})

const mapDispatchToProps = (dispatch: (...args: any) => void): ProjectEditorDispatchToProps => ({
    save: (project: Partial<ProjectInfo>) => dispatch(insert('projects', project)),
    update: (project: Partial<ProjectInfo>) => dispatch(update('projects', project, true)),
    clearError: () => dispatch(removeError('projects')),
})

export const ProjectEditor = connect(mapStateToProps, mapDispatchToProps)(ProjectEditorComponent)
