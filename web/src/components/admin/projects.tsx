import { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import type { ProjectsDispatchToProps, ProjectsStateToProps } from '../../containers/admin/projects'
import { ProjectsHome } from '../../containers/admin/projects/home'
import { ProjectEditor } from '../../containers/admin/projects/editor'

type ProjectsPageProps = ProjectsStateToProps & ProjectsDispatchToProps

export default class Posts extends Component<ProjectsPageProps> {
  componentDidMount() {
    const { subscribe } = this.props
    subscribe()
  }

  componentWillUnmount() {
    const { unsubscribe } = this.props
    unsubscribe()
  }

  render() {
    return (
      <Switch>
        <Route exact path="/admin/projects/" component={ProjectsHome} />
        <Route path="/admin/projects/create" component={ProjectEditor} />
        <Route path="/admin/projects/edit/:id" component={ProjectEditor} />
      </Switch>
    )
  }
}
