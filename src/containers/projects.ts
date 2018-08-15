import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { removeError, subscribe, unsubscribe } from 'src/redux/database/actions';
import { changeTitle } from 'src/redux/title/actions';
import { State } from 'src/redux/reducers';
import ProjectsComponent from 'src/components/projects/projects';

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
    changeTitle: (title: string) => void;
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
    changeTitle: (title: String) => dispatch(changeTitle(title)),
});

export const Projects = translate()(connect(mapStateToProps, mapDispatchToProps)(ProjectsComponent));
export const Component = Projects;