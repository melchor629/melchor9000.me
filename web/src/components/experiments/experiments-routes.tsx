import React, { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Experiments from './experiments'

const Viz = lazy(() => import('../viz'))
const Eugl = lazy(() => import('../eugl'))

const ExperimentsRoutes = () => (
  <div>

    <Helmet>
      <title>Experiments</title>
      <meta name="description" content="Experiments of mine, the page" />
    </Helmet>

    <Switch>
      <Route path="/experiments/eugl" component={Eugl} exact />
      <Route path="/experiments/viz" component={Viz} exact />
      <Route path="/experiments" component={Experiments} />
    </Switch>

  </div>
)

export default ExperimentsRoutes
