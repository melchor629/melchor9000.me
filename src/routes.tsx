import * as React from 'react';
import { withDefaultContainer } from './components/default-container';
import asyncComponent from './components/async-component';

type LeComponent<Props, State> = React.ComponentType<Props>;

export interface Route<Props = any, State = any> {
    route: string;
    title: string;
    component: LeComponent<Props, State>;
    extra: any;
    private: boolean;
}

function route<Props = any, State = any>(_route: string,
                                         title: string,
                                         component: LeComponent<Props, State>, extra?: any): Route<Props, State> {
    return {
        route: _route, title, component, extra: extra || {}, private: false,
    };
}

function privateRoute<Props = any, State = any>(_route: string,
                                                title: string,
                                                component: LeComponent<Props, State>,
                                                extra?: any): Route<Props, State> {
    return {
        route: _route, title, component, extra: extra || {}, private: true,
    };
}

const AboutMe = asyncComponent(() => import('./components/about-me'));
const Projects = asyncComponent(() => import('./containers/projects'));
const Home = asyncComponent(() => import('./containers/home'));
const Gallery = asyncComponent(() => import('./components/gallery'));
const Posts = asyncComponent(() => import('./containers/posts'));
const Viz = asyncComponent(() => import('./containers/viz'));
const EuglPage = asyncComponent(() => import('./components/eugl'));
const Admin = asyncComponent(() => import('./containers/admin/admin'));

export const routes: Route<any, any>[] = [
    route('/', 'Home', withDefaultContainer(Home), { exact: true }),
    route('/about-me', 'About me', withDefaultContainer(AboutMe)),
    route('/eugl', 'Espacio Euclídeo', withDefaultContainer(EuglPage)),
    route('/gallery', 'Photo Gallery', Gallery),
    route('/blog', 'Posts', withDefaultContainer(Posts)),
    route('/projects', 'Projects', withDefaultContainer(Projects)),
    route('/viz', 'Viz', withDefaultContainer(Viz)),
    privateRoute('/admin', 'Admin page', Admin),
];