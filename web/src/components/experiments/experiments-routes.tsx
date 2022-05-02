import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Experiments from './experiments'
import { DefaultContainer, withDefaultContainer } from '../default-container'

const Viz = withDefaultContainer(lazy(() => import('../viz')))
const Eugl = withDefaultContainer(lazy(() => import('../eugl')))
const NowPlaying = lazy(() => import('./now-playing'))

const ExperimentsRoutes = () => (
  <>
    <Helmet>
      <title>Experiments</title>
      <meta name="description" content="Experiments of mine, the page" />
    </Helmet>

    <Routes>
      <Route path="eugl" element={<Eugl />} />
      <Route path="viz" element={<Viz />} />
      <Route path="now-playing" element={<NowPlaying />} />
      <Route path="now-playing/:user" element={<NowPlaying />} />
      <Route index element={<DefaultContainer><Experiments /></DefaultContainer>} />
    </Routes>
  </>
)

export default ExperimentsRoutes
