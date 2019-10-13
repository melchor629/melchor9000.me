import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ProjectsDispatchToProps, ProjectsStateToProps } from '../../containers/admin/projects'
import { ProjectsHome } from '../../containers/admin/projects/home'
import { ProjectEditor } from '../../containers/admin/projects/editor'

type ProjectsPageProps = ProjectsStateToProps & ProjectsDispatchToProps

export default class Posts extends React.Component<ProjectsPageProps> {
    componentDidMount() {
        this.props.subscribe()
    }

    componentWillUnmount() {
        this.props.unsubscribe()
    }

    render() {
        return (
            <Switch>
                <Route exact={ true } path="/admin/projects/" component={ ProjectsHome } />
                <Route path="/admin/projects/create" component={ ProjectEditor } />
                <Route path="/admin/projects/edit/:id" component={ ProjectEditor } />
            </Switch>
        )
    }
}
