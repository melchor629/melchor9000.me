import React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { animated, Trail } from 'react-spring/renderprops'
import { Helmet } from 'react-helmet'
import type { AdminDispatchToProps, AdminStateToProps } from '../../containers/admin/admin'
import { Posts } from '../../containers/admin/posts'
import { Projects } from '../../containers/admin/projects'
import { Logout } from '../../containers/admin/logout'
import './admin.scss'

const containerStyle: React.CSSProperties = { width: '100%' }

type AdminPageProps = AdminDispatchToProps & AdminStateToProps & RouteComponentProps<null>

const pages = ['/admin/posts', '/admin/projects']
const Home = ({ user, style }: AdminPageProps & { style?: React.CSSProperties }) => (
  <div className="row align-items-center justify-content-center text-center" style={{ ...containerStyle, ...style }}>
    <div className="col-auto">
      <h1 className="display-4">
        Hola
        { user.displayName }
      </h1>
    </div>
    <Trail native from={{ scale: 0 }} to={{ scale: 1 }} keys={pages} items={pages}>
      { (page) => ({ scale }: any) => (
        <animated.div
          className="col-4 col-md-3 col-lg-2"
          style={{ transform: scale.interpolate((x: number) => `scale(${x})`) }}
        >
          <Link to={page}>
            <p className="lead">{ page }</p>
          </Link>
        </animated.div>
      ) }
    </Trail>
  </div>
)

Home.defaultProps = {
  style: {},
}

const AdminPage = ({ darkMode, ...props }: AdminPageProps) => (
  <div className="container-fluid">

    <Helmet>
      <title>Admin page</title>
      <meta
        name="Description"
        content="Administration page"
      />
    </Helmet>

    <div className="row">
      <nav className={`col-md-2 d-none d-md-block ${darkMode ? 'bg-dark' : 'bg-light'} sidebar`}>
        <div className="text-center mt-4 sidebar-heading">
          <img
            src={`${process.env.PUBLIC_URL}/ico/favicon.png`}
            style={{ maxWidth: 180 }}
            alt="Web icon"
          />
          <p className="mt-2">Panel de administración</p>
        </div>
        <div className="sidebar-sticky">
          <ul className="nav flex-column mb-2">
            <li className="nav-item">
              <NavLink exact to="/admin" className="nav-link" activeClassName="active">
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
          <Route
            exact
            path="/admin"
            component={() => React.createElement(Home, { ...props, darkMode })}
          />
          <Route path="/admin/posts" component={Posts} />
          <Route path="/admin/projects" component={Projects} />
          <Route path="/admin/logout" component={Logout} />
        </Switch>
      </main>
    </div>
  </div>
)

export default AdminPage
