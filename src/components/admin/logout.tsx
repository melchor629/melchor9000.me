import React from 'react';
import { Redirect } from 'react-router';
import { LogoutDispatchToProps, LogoutStateToProps } from 'src/containers/admin/logout';

export default class LogoutPage extends React.Component<LogoutStateToProps & LogoutDispatchToProps> {

    componentDidMount() {
        this.props.logOut();
        this.props.changeTitle('Logging out…');
    }

    render() {
        return (
            <Redirect to="/" />
        );
    }

}