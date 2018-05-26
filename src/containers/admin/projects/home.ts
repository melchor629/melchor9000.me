import { connect } from 'react-redux';
import { State } from 'src/redux/reducers';
import { changeTitle } from 'src/redux/title/actions';
import { remove, removeError } from 'src/redux/database/actions';
import ProjectsHomeComponent from 'src/components/admin/projects/home';
import { ProjectInfo } from 'src/containers/admin/projects';

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
