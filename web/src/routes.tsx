import * as React from 'react'
import { withDefaultContainer } from './components/default-container'
import asyncComponent from './components/async-component'

type LeComponent<Props> = React.ComponentType<Props>

export interface Route<Props = any> {
  route: string
  title: string
  component: LeComponent<Props>
  extra: any
  private: boolean
}

function route<Props = any>(_route: string,
  title: string,
  component: LeComponent<Props>, extra?: any): Route<Props> {
  return {
    route: _route, title, component, extra: extra || {}, private: false,
  }
}

function privateRoute<Props = any>(_route: string,
  title: string,
  component: LeComponent<Props>,
  extra?: any): Route<Props> {
  return {
    route: _route, title, component, extra: extra || {}, private: true,
  }
}

const AboutMe = asyncComponent(() => import('./components/about-me'))
const Projects = asyncComponent(() => import('./components/projects'))
const Home = asyncComponent(() => import('./containers/home'))
const Gallery = asyncComponent(() => import('./components/gallery'))
const Posts = asyncComponent(() => import('./containers/posts'))
const Experiments = asyncComponent(() => import('./components/experiments'))
const SupportMe = asyncComponent(() => import('./components/support-me'))
const Admin = asyncComponent(() => import('./containers/admin/admin'))

export const routes: Array<Route<any>> = [
  route('/', 'Home', withDefaultContainer(Home), { exact: true }),
  route('/about-me', 'About me', withDefaultContainer(AboutMe)),
  route('/gallery', 'Photo Gallery', Gallery),
  route('/blog', 'Posts', withDefaultContainer(Posts)),
  route('/projects', 'Projects', withDefaultContainer(Projects)),
  route('/experiments', 'Experiments', withDefaultContainer(Experiments)),
  route('/support-me', 'Support Me', withDefaultContainer(SupportMe)),
  privateRoute('/admin', 'Admin page', Admin),
]
