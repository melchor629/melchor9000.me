import * as React from 'react'
import { Redirect, Route } from 'react-router'
import { connect } from 'react-redux'
import { State } from '../redux/reducers'

type PrivateRouteProps = {
    component: React.ComponentType<any>
    loggedIn: boolean
    [extraProps: string]: any
}

const PrivateRoute = ({ component: Component, loggedIn, ...rest }: PrivateRouteProps) => (
    <Route
        {...rest}
        render={ props =>
            loggedIn ?
                <Component {...props} /> :
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        } />
)

const mapStateToProps = (state: State) => ({ loggedIn: !!state.auth.user })

export default (connect(mapStateToProps)(PrivateRoute))
