import { connect } from 'react-redux'
import { subscribe, unsubscribe } from '../../redux/database/actions'
import ProjectsComponent from '../../components/admin/projects'
import type { ProjectInfo as JajaProjectInfo } from '../../components/projects/projects'

export type ProjectInfo = JajaProjectInfo

export interface ProjectsStateToProps {}

export interface ProjectsDispatchToProps {
  subscribe: () => void
  unsubscribe: () => void
}

const mapStateToProps = (): ProjectsStateToProps => ({})

const mapDispatchToProps = (dispatch: any): ProjectsDispatchToProps => ({
  subscribe: () => dispatch(subscribe('projects')),
  unsubscribe: () => dispatch(unsubscribe('projects')),
})

export const Projects = connect(mapStateToProps, mapDispatchToProps)(ProjectsComponent)
export const Component = Projects
