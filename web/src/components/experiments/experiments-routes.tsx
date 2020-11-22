import { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Experiments from './experiments'
import { withDefaultContainer } from '../default-container'

const Viz = withDefaultContainer(lazy(() => import('../viz')))
const Eugl = withDefaultContainer(lazy(() => import('../eugl')))
const NowPlaying = lazy(() => import('./now-playing'))

const ExperimentsRoutes = () => (
  <>
    <Helmet>
      <title>Experiments</title>
      <meta name="description" content="Experiments of mine, the page" />
    </Helmet>

    <Switch>
      <Route path="/experiments/eugl" component={Eugl} exact />
      <Route path="/experiments/viz" component={Viz} exact />
      <Route path="/experiments/now-playing" component={NowPlaying} exact />
      <Route path="/experiments/now-playing/:user" component={NowPlaying} exact />
      <Route path="/experiments" component={withDefaultContainer(Experiments)} />
    </Switch>
  </>
)

export default ExperimentsRoutes
