import { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
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
      <Routes>
        <Route index element={<ProjectsHome />} />
        <Route path="create" element={<ProjectEditor />} />
        <Route path="edit/:id" element={<ProjectEditor />} />
      </Routes>
    )
  }
}
