import { connect } from 'react-redux';
import { State } from '../../../redux/reducers';
import { changeTitle } from '../../../redux/title/actions';
import { insert, removeError, update } from '../../../redux/database/actions';
import ProjectEditorComponent from '../../../components/admin/projects/editor';
import { ProjectInfo } from '../projects';

export interface ProjectEditorStateToProps {
    saving: boolean;
    errorSaving: any | null;
}

export interface ProjectEditorDispatchToProps {
    save: (project: ProjectInfo) => void;
    update: (projectInfo: ProjectInfo) => void;
    changeTitle: (title: string) => void;
    clearError: () => void;
}

const mapStateToProps = (state: State): ProjectEditorStateToProps => ({
    saving: state.database.doing.projects,
    errorSaving: state.database.errors.projects,
});

const mapDispatchToProps = (dispatch: any): ProjectEditorDispatchToProps => ({
    save: (project: ProjectInfo) => dispatch(insert('projects', project)),
    update: (project: ProjectInfo) => dispatch(update('projects', project, true)),
    changeTitle: (title: string) => dispatch(changeTitle(title)),
    clearError: () => dispatch(removeError('projects')),
});

export const ProjectEditor = connect(mapStateToProps, mapDispatchToProps)(ProjectEditorComponent);
