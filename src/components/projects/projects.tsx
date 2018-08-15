import React from 'react';
import { InjectedTranslateProps, InjectedI18nProps } from 'react-i18next';
import * as toast from 'src/lib/toast';
import LoadSpinner from 'src/components/load-spinner';
import Project from 'src/components/project';
import { ProjectDispatchToProps, ProjectStateToProps } from 'src/containers/projects';

type ProjectsPageProps = ProjectStateToProps & ProjectDispatchToProps & InjectedTranslateProps & InjectedI18nProps;

export default class Projects extends React.Component<ProjectsPageProps> {
    componentDidMount() {
        this.props.subscribe();
        this.props.changeTitle('Projects');
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
