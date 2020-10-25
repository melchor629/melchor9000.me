import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import asyncComponent from '../async-component'
import Experiments from './experiments'

const Viz = asyncComponent(() => import('../../containers/viz'))
const Eugl = asyncComponent(() => import('../eugl'))

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
