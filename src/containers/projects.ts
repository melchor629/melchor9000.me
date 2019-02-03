import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { removeError, subscribe, unsubscribe } from '../redux/database/actions';
import { State } from '../redux/reducers';
import ProjectsComponent from '../components/projects/projects';

export interface ProjectInfo {
    title: string;
    repo: string;
    demo: string;
    web: string;
    image?: string;
    technologies: string[];
    description: string;
    intlDescription?: { [lang: string]: string };
}

export interface ProjectStateToProps {
    projects: ProjectInfo[];
    darkMode: boolean;
    subscriptionError: Error;
}

export interface ProjectDispatchToProps {
    subscribe: () => void;
    unsubscribe: () => void;
    removeError: () => void;
}

const mapStateToProps = ({ database, effects }: State): ProjectStateToProps => ({
    projects: database.snapshots.projects ? database.snapshots.projects
        .sort((a: ProjectInfo, b: ProjectInfo) => a.title.localeCompare(b.title)) : undefined,
    darkMode: effects.darkMode,
    subscriptionError: database.snapshots.projectsError
});

const mapDispatchToProps = (dispatch: any): ProjectDispatchToProps => ({
    subscribe: () => dispatch(subscribe('projects')),
    unsubscribe: () => dispatch(unsubscribe('projects')),
    removeError: () => dispatch(removeError('projects')),
});

export const Projects = withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(ProjectsComponent));
export const Component = Projects;