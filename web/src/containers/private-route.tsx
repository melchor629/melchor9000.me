import React from 'react'
import {
  Redirect,
  Route,
  RouteProps,
  RouteComponentProps,
} from 'react-router'
import { useSelector } from 'react-redux'

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>
}

const RedirectToLogin = ({ location }: RouteComponentProps) => (
  <Redirect to={{ pathname: '/login', state: { from: location } }} />
)

const PrivateRoute = ({ component, ...rest }: PrivateRouteProps) => {
  const loggedIn = useSelector(({ auth }) => !!auth.user)

  if (!loggedIn) {
    return React.createElement(Route, {
      ...rest,
      component: RedirectToLogin,
    })
  }

  return React.createElement(Route, {
    ...rest,
    component,
  })
}

export default PrivateRoute
