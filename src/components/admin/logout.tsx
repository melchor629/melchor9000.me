import React from 'react';
import { Redirect } from 'react-router';
import { LogoutDispatchToProps, LogoutStateToProps } from '../../containers/admin/logout';

export default class LogoutPage extends React.Component<LogoutStateToProps & LogoutDispatchToProps> {

    componentDidMount() {
        this.props.logOut();
    }

    render() {
        return (
            <Redirect to="/" />
        );
    }

}