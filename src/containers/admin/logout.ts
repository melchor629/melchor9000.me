import { User } from '@firebase/auth-types';
import { connect } from 'react-redux';
import { State } from '../../redux/reducers';
import { changeTitle } from '../../redux/title/actions';
import { logOut } from '../../redux/auth/actions';
import LogoutComponent from '../../components/admin/logout';

export interface LogoutStateToProps {
    user: User | null;
}

export interface LogoutDispatchToProps {
    logOut: () => void;
    changeTitle: (title: string) => void;
}

const mapStateToProps = (state: State): LogoutStateToProps => ({
    user: state.auth.user,
});

const mapDispatchToProps = (dispatch: any): LogoutDispatchToProps => ({
    logOut: () => dispatch(logOut()),
    changeTitle: (title: string) => dispatch(changeTitle(title)),
});

export const Logout = connect(mapStateToProps, mapDispatchToProps)(LogoutComponent);
