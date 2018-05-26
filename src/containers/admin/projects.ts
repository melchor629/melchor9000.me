import { connect } from 'react-redux';
import { changeTitle } from 'src/redux/title/actions';
import { subscribe, unsubscribe } from 'src/redux/database/actions';
import ProjectsComponent from 'src/components/admin/projects';

export interface ProjectInfo {
    _id?: string;
    title: string;
    repo: string;
    demo?: string;
    web?: string;
    image?: string;
    technologies: string[];
    description: string;
}

export interface ProjectsStateToProps {}

export interface ProjectsDispatchToProps {
    changeTitle: (title: string) => void;
    subscribe: () => void;
    unsubscribe: () => void;
}

const mapStateToProps = (): ProjectsStateToProps => ({});

const mapDispatchToProps = (dispatch: any): ProjectsDispatchToProps => ({
    changeTitle: (title: string) => dispatch(changeTitle(title)),
    subscribe: () => dispatch(subscribe('projects')),
    unsubscribe: () => dispatch(unsubscribe('projects')),
});

export const Projects = connect(mapStateToProps, mapDispatchToProps)(ProjectsComponent);
export const Component = Projects;
