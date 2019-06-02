import React from 'react';
import { WithTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import * as toast from '../../lib/toast';
import LoadSpinner from '../load-spinner';
import Project from './project';
import { ProjectDispatchToProps, ProjectStateToProps } from '../../containers/projects';
import './projects.scss';

type ProjectsPageProps = ProjectStateToProps & ProjectDispatchToProps & WithTranslation;

export default class Projects extends React.Component<ProjectsPageProps> {
    componentDidMount() {
        this.props.subscribe();
    }

    componentWillUnmount() {
        this.props.unsubscribe();
    }

    componentDidUpdate(nextProps: ProjectStateToProps & ProjectDispatchToProps): void {
        if(nextProps.subscriptionError) {
            toast.error(() => (
                <div>
                    { this.props.t('projects.couldNotLoad') } <br/>
                    <span className="text-muted">{ nextProps.subscriptionError.message }</span>
                </div>
            ));
            this.props.removeError();
        }
    }

    render() {
        const { projects, darkMode, t } = this.props;
        let projectsDiv: any[] | null = null;
        if(projects) {
            projectsDiv = projects.map((project, i) =>
                <Project project={ project } key={ i } darkMode={ darkMode } />);
        }
        return (
            <div>

                <Helmet>
                    <title>Projects</title>
                    <meta name="Description"
                          content="Page of my code projects" />
                </Helmet>

                <div className="page-header">
                    <h1>{ t('projects.title') } <small>{ t('projects.subtitle') }</small></h1>
                    <p className="lead">
                        { t('projects.description') }
                    </p>
                </div>

                { projects ? (
                    <div className="card-columns">{ projectsDiv }</div>
                ) :
                    <LoadSpinner />
                }
            </div>
        );
    }
}
