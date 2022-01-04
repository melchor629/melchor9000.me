import clsx from 'clsx'
import React from 'react'
import { Route, Routes } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { animated, useTrail } from '@react-spring/web'
import { Helmet } from 'react-helmet'
import type { AdminDispatchToProps, AdminStateToProps } from '../../containers/admin/admin'
import { Posts } from '../../containers/admin/posts'
import { Projects } from '../../containers/admin/projects'
import { Logout } from '../../containers/admin/logout'
import './admin.scss'

const containerStyle: React.CSSProperties = { width: '100%' }

type AdminPageProps = AdminDispatchToProps & AdminStateToProps

const pages = ['/admin/posts', '/admin/projects']
const Home = ({ user, style }: Pick<AdminPageProps, 'user'> & { style?: React.CSSProperties }) => {
  const trail = useTrail(pages.length, {
    from: { scale: 0 },
    to: { scale: 1 },
  })
  return (
    <div className="row align-items-center justify-content-center text-center" style={{ ...containerStyle, ...style }}>
      <div className="col-auto">
        <h1 className="display-4">
          Hola
          { user.displayName }
        </h1>
      </div>
      {trail.map(({ scale }, i) => (
        <animated.div
          className="col-4 col-md-3 col-lg-2"
          style={{ transform: scale.to((x) => `scale(${x})`) }}
        >
          <Link to={pages[i]}>
            <p className="lead">{pages[i]}</p>
          </Link>
        </animated.div>
      ))}
    </div>
  )
}

Home.defaultProps = {
  style: {},
}

const navLinkClasses = ({ isActive }: { isActive: boolean }) => clsx('nav-link', isActive && 'active')
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
              <NavLink to="/" className={navLinkClasses}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="posts" className={navLinkClasses}>
                Posts
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="projects" className={navLinkClasses}>
                Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="logout" className={navLinkClasses}>
                Log out
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
        <Routes>
          <Route
            index
            element={React.createElement(Home, props)}
          />
          <Route path="posts" element={<Posts />} />
          <Route path="projects" element={<Projects />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </main>
    </div>
  </div>
)

export default AdminPage
