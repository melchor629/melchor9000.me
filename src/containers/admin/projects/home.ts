import { connect } from 'react-redux';
import { State } from '../../../redux/reducers';
import { changeTitle } from '../../../redux/title/actions';
import { remove, removeError } from '../../../redux/database/actions';
import ProjectsHomeComponent from '../../../components/admin/projects/home';
import { ProjectInfo } from '../projects';

export interface ProjectsHomeStateToProps {
    projects: ProjectInfo[];
    deleting: boolean;
    errorDeleting: any | null;
}

export interface ProjectsHomeDispatchToProps {
    changeTitle: (title: string) => void;
    delete: (post: ProjectInfo) => void;
    clearError: () => void;
}

const mapStateToProps = (state: State): ProjectsHomeStateToProps => ({
    projects: (<ProjectInfo[]> (state.database.snapshots.projects || []))
        .sort((a, b) => a.title.localeCompare(b.title)),
    deleting: state.database.doing.posts,
    errorDeleting: state.database.errors.posts,
});

const mapDispatchToProps = (dispatch: any): ProjectsHomeDispatchToProps => ({
    changeTitle: (title: string) => dispatch(changeTitle(title)),
    delete: (post: ProjectInfo) => dispatch(remove('projects', post)),
    clearError: () => dispatch(removeError('projects'))
});

export const ProjectsHome = connect(mapStateToProps, mapDispatchToProps)(ProjectsHomeComponent);
