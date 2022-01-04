import {
  lazy,
  ComponentType,
  FC,
  Suspense,
} from 'react'
import { Routes, Route, Outlet } from 'react-router'
import { DefaultContainer } from './components/default-container'
import LoadSpinner from './components/load-spinner'
import PrivateRoute from './containers/private-route'

const AppRouteLoading = () => (
  <div className="d-flex justify-content-center pt-5">
    <LoadSpinner />
  </div>
)

const LazyRoute = ({ children }: any) => (
  <Suspense fallback={<AppRouteLoading />}>
    {children}
  </Suspense>
)

const DefaultLayout = () => <DefaultContainer><Outlet /></DefaultContainer>

function withLazyRoute(fn: () => Promise<{ default: ComponentType<any> }>): FC {
  const Component = lazy(fn)
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (props) => <LazyRoute><Component {...props} /></LazyRoute>
}

const AboutMe = withLazyRoute(() => import('./components/about-me'))
const Projects = withLazyRoute(() => import('./components/projects'))
const Home = withLazyRoute(() => import('./containers/home'))
const Gallery = withLazyRoute(() => import('./components/gallery'))
const Posts = withLazyRoute(() => import('./containers/posts'))
const Experiments = withLazyRoute(() => import('./components/experiments'))
const SupportMe = withLazyRoute(() => import('./components/support-me'))
const Admin = withLazyRoute(() => import('./containers/admin/admin'))

const Login = withLazyRoute(() => import('./containers/login'))
const PageNotFound = withLazyRoute(() => import('./components/404/404'))

const AppRoutes = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      <Route index element={<Home />} />
      <Route path="about-me" element={<AboutMe />} />
      <Route path="blog/*" element={<Posts />} />
      <Route path="projects" element={<Projects />} />
      <Route path="support-me" element={<SupportMe />} />
      <Route path="login" element={<Login />} />
    </Route>

    <Route path="gallery/*" element={<Gallery />} />
    <Route path="experiments/*" element={<Experiments />} />
    <Route path="admin/*" element={<PrivateRoute><Admin /></PrivateRoute>} />

    <Route path="*" element={<PageNotFound />} />
  </Routes>
)

export default AppRoutes
