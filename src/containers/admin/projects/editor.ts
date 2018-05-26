import { connect } from 'react-redux';
import { State } from 'src/redux/reducers';
import { changeTitle } from 'src/redux/title/actions';
import { insert, removeError, update } from 'src/redux/database/actions';
import ProjectEditorComponent from 'src/components/admin/projects/editor';
import { ProjectInfo } from 'src/containers/admin/projects';

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
