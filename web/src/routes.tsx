import { lazy, ComponentType } from 'react'
import { withDefaultContainer } from './components/default-container'

type LeComponent<Props> = ComponentType<Props>

export interface Route<Props = any> {
  route: string
  title: string
  component: LeComponent<Props>
  extra: any
  private: boolean
}

function route<Props = any>(
  _route: string,
  title: string,
  component: LeComponent<Props>,
  extra?: any,
): Route<Props> {
  return {
    route: _route, title, component, extra: extra || {}, private: false,
  }
}

function privateRoute<Props = any>(
  _route: string,
  title: string,
  component: LeComponent<Props>,
  extra?: any,
): Route<Props> {
  return {
    route: _route, title, component, extra: extra || {}, private: true,
  }
}

const AboutMe = lazy(() => import('./components/about-me'))
const Projects = lazy(() => import('./components/projects'))
const Home = lazy(() => import('./containers/home'))
const Gallery = lazy(() => import('./components/gallery'))
const Posts = lazy(() => import('./containers/posts'))
const Experiments = lazy(() => import('./components/experiments'))
const SupportMe = lazy(() => import('./components/support-me'))
const Admin = lazy(() => import('./containers/admin/admin'))

export const routes: Array<Route<any>> = [
  route('/', 'Home', withDefaultContainer(Home), { exact: true }),
  route('/about-me', 'About me', withDefaultContainer(AboutMe)),
  route('/gallery', 'Photo Gallery', Gallery),
  route('/blog', 'Posts', withDefaultContainer(Posts)),
  route('/projects', 'Projects', withDefaultContainer(Projects)),
  route('/experiments', 'Experiments', Experiments),
  route('/support-me', 'Support Me', withDefaultContainer(SupportMe)),
  privateRoute('/admin', 'Admin page', Admin),
]
