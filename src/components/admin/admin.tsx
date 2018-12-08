import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { Trail, animated } from 'react-spring';
import { AdminDispatchToProps, AdminStateToProps } from '../../containers/admin/admin';
import { Posts } from '../../containers/admin/posts';
import { Projects } from '../../containers/admin/projects';
import { Logout } from '../../containers/admin/logout';
import './admin.css';

const containerStyle: React.CSSProperties = {
    width: '100%',
};

interface AdminPageState {
}

type AdminPageProps = AdminDispatchToProps & AdminStateToProps & RouteComponentProps<null>;

const pages = [ '/admin/posts', '/admin/projects' ];
const Home = ({ user, style }: AdminPageProps & { style?: React.CSSProperties }) => (
    <div className="row align-items-center justify-content-center text-center" style={{ ...containerStyle, ...style }}>
        <div className="col-auto">
            <h1 className="display-4">Hola { user.displayName }</h1>
        </div>
        <Trail native={ true } from={{ scale: 0 }} to={{ scale: 1 }} keys={ pages } items={ pages }>
            { page => ({ scale }: any) => (
                <animated.div
                    className="col-4 col-md-3 col-lg-2"
                    style={{ transform: scale.interpolate((x: number) => `scale(${x})`) }}>
                    <Link to={ page }>
                        <p className="lead">{ page }</p>
                    </Link>
                </animated.div>
            ) }
        </Trail>
    </div>
);

export default class AdminPage extends React.Component<AdminPageProps, AdminPageState> {

    constructor(props: AdminPageProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.changeTitle('Admin page');
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                        <div className="text-center mt-4 sidebar-heading">
                            <img src={ `${process.env.PUBLIC_URL}/ico/favicon.png` } style={{ maxWidth: 180 }}
                                 alt="Web icon" />
                            <p className="mt-2">Panel de administración</p>
                        </div>
                        <div className="sidebar-sticky">
                            <ul className="nav flex-column mb-2">
                                <li className="nav-item">
                                    <NavLink exact={ true } to="/admin" className="nav-link" activeClassName="active">
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/posts" className="nav-link" activeClassName="active">
                                        Posts
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/projects" className="nav-link" activeClassName="active">
                                        Projects
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/admin/logout" className="nav-link" activeClassName="active">
                                        Log out
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                        <Switch>
                            <Route exact={true}
                                   path="/admin"
                                   component={ () => <Home {...this.props} /> } />
                            <Route path="/admin/posts" component={ Posts } />
                            <Route path="/admin/projects" component={ Projects } />
                            <Route path="/admin/logout" component={ Logout } />
                        </Switch>
                    </main>
                </div>
            </div>
        );
    }
}