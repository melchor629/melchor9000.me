import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { routes } from './routes';
import { State } from './redux/reducers';
import PrivateRoute from './containers/private-route';
import { changeTitle } from './redux/title/actions';
import { withDefaultContainer } from './components/default-container';
import asyncComponent from './components/async-component';

import './app.css';

const PageNotFound = asyncComponent(() => import('./components/404/404'));
const Login = asyncComponent(() => import('./containers/login'));

interface AppStateToProps {
    barrelRoll: boolean;
    flipIt?: boolean | null;
    darkMode?: boolean | null;
}

type AppPropTypes = AppStateToProps & RouteComponentProps<{}> & { changeTitle: (title: string | null) => void };

class App extends React.Component<AppPropTypes> {
    constructor(props: AppPropTypes) {
        super(props);
        //Maybe this will change depending on what componentDidUpdate has in the future
        this.componentDidUpdate({ ...props, darkMode: null });

        props.history.listen(() => {
            this.props.changeTitle(null);
        });
    }

    componentDidUpdate(prevProps: AppPropTypes) {
        if(prevProps.flipIt !== this.props.flipIt) {
            if(this.props.flipIt === null) {
                document.body.classList.remove('iflip');
            } else if(this.props.flipIt) {
                document.body.classList.add('flip');
            } else {
                document.body.classList.add('iflip');
                document.body.classList.remove('flip');
            }
        } else if(prevProps.barrelRoll !== this.props.barrelRoll) {
            if(this.props.barrelRoll) {
                document.body.classList.add('barrel-roll');
            } else {
                document.body.classList.remove('barrel-roll');
            }
        } else if(prevProps.darkMode !== this.props.darkMode) {
            if(this.props.darkMode) {
                document.body.classList.add('darkmode');
            } else {
                document.body.classList.remove('darkmode');
            }
        }
    }

    render() {
        const { history } = this.props;
        const linkActive = (route: any) => {
            if(route.extra && route.extra.exact) {
                return history.location.pathname === route.route ? 'active' : '';
            } else {
                return history.location.pathname.startsWith(route.route) ? 'active' : '';
            }
        };
        return (
            <div className="wrap">

                <nav className="navbar navbar-default navbar-dark navbar-expand-md fixed-top">
                    <Link className="navbar-brand" to="/">The Abode of melchor9000</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            { routes.filter(route => !route.private && route.title).map((route, pos) => (
                                <li className={`nav-item ${linkActive(route)}`} key={ pos }>
                                    <Link to={ route.route } className="nav-link">{ route.title }</Link>
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
        );
    }
}

const mapStateToProps = (state: State): AppStateToProps => ({
    barrelRoll: state.effects.barrelRoll,
    flipIt: state.effects.flipIt,
    darkMode: state.effects.darkMode
});

const mapDispatchToProps = (dispatch: any): { changeTitle: (title: string) => void } => ({
    changeTitle: (title: string) => dispatch(changeTitle(title)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
