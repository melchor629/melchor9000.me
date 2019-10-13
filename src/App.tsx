import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Switch, withRouter } from 'react-router'
import { Link, Route, RouteComponentProps } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

import { routes } from './routes'
import { State } from './redux/reducers'
import PrivateRoute from './containers/private-route'
import { withDefaultContainer } from './components/default-container'
import asyncComponent from './components/async-component'

import './app.scss'

const PageNotFound = asyncComponent(() => import('./components/404/404'))
const Login = asyncComponent(() => import('./containers/login'))

const App: FC<RouteComponentProps & WithTranslation> = ({ history, t }) => {
    const [ offcanvas, setOffcanvas ] = useState(false)
    const [ navbarExtraClases, setNavbarExtraClasses ] = useState<string[]>([])
    const { barrelRoll, flipIt, darkMode, navbarHideMode } = useSelector((state: State) => ({
        barrelRoll: state.effects.barrelRoll,
        flipIt: state.effects.flipIt,
        darkMode: state.effects.darkMode,
        navbarHideMode: state.effects.navbarHideMode,
    }))

    const linkActive = (route: any) => {
        if(route.extra && route.extra.exact) {
            return history.location.pathname === route.route ? 'active' : ''
        } else {
            return history.location.pathname.startsWith(route.route) ? 'active' : ''
        }
    }

    const toggleNavigation = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setOffcanvas(!offcanvas)
    }

    useEffect(() => {
        if(flipIt === null) {
            document.body.classList.remove('iflip')
        } else if(flipIt) {
            document.body.classList.add('flip')
        } else {
            document.body.classList.add('iflip')
            document.body.classList.remove('flip')
        }
    }, [ flipIt ])

    useEffect(() => {
        if(barrelRoll) {
            document.body.classList.add('barrel-roll')
        } else {
            document.body.classList.remove('barrel-roll')
        }
    }, [ barrelRoll ])

    useEffect(() => {
        if(darkMode) {
            document.body.classList.add('darkmode')
        } else {
            document.body.classList.remove('darkmode')
        }
    }, [ darkMode ])

    useEffect(() => {
        if(navbarHideMode === null && navbarExtraClases.length > 0) {
            setNavbarExtraClasses([])
        } else if(navbarHideMode === 'top-only') {
            const onScroll = () => {
                if(window.scrollY > 125 && navbarExtraClases.includes('hide-top')) {
                    setNavbarExtraClasses([])
                } else if(window.scrollY <= 125 && !navbarExtraClases.includes('hide-top')) {
                    setNavbarExtraClasses([ 'hide-top' ])
                }
            }
            onScroll()
            window.addEventListener('scroll', onScroll, { passive: true })
            return () => window.removeEventListener('scroll', onScroll)
        } else if(navbarHideMode === 'always' && !navbarExtraClases.includes('hide')) {
            setNavbarExtraClasses([ 'hide' ])
        }

        return () => undefined
    }, [ navbarHideMode, navbarExtraClases ])

    const navbarClasses = `navbar navbar-default navbar-dark navbar-expand-lg fixed-top ${navbarExtraClases.join(' ')}`
    return (
        <div className="wrap">

            <Helmet titleTemplate="%s - The abode of melchor9000"
                defaultTitle="The abode of melchor9000">
                <base href={ process.env.PUBLIC_URL } />
                <meta name="Description"
                    content="The abode of melchor9000 - Personal webpage for Melchor Alejo Garau Madrigal
                        (aka melchor9000, aka melchor629)" />
            </Helmet>

            <nav className={ navbarClasses }>
                <button className="navbar-toggler" type="button" onClick={ toggleNavigation }
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <Link className="navbar-brand" to="/">The Abode of melchor9000</Link>

                <div className={ `collapse navbar-collapse offcanvas-collapse ${offcanvas ? 'open' : ''}` }
                    id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        { routes.filter(route => !route.private && route.title).map((route, pos) => (
                            <li className={`nav-item ${linkActive(route)}`} key={ pos }>
                                <Link to={ route.route }
                                    className="nav-link"
                                    onClick={ () => setOffcanvas(false) }>
                                    { t(`${route.route.substr(1)}.title`, { defaultValue: route.title }) }
                                </Link>
                            </li>
                        )) }
                    </ul>
                </div>
            </nav>

            <ToastContainer pauseOnHover={ false } />

            <Switch>
                { routes
                    .filter(route => !route.private)
                    .map((route, pos) => <Route path={ route.route } component={ route.component }
                        key={ pos } {...route.extra} />) }
                { routes
                    .filter(route => route.private)
                    .map((route, pos) => <PrivateRoute path={ route.route } component={ route.component }
                        key={ pos } {...route.extra} />) }
                <Route path="/login" component={ withDefaultContainer(Login) } />
                <Route component={ withDefaultContainer(PageNotFound) } />
            </Switch>

        </div>
    )
}

export default withTranslation('translations')(withRouter(App))
