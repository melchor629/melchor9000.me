import { User } from '@firebase/auth-types';
import { connect } from 'react-redux';
import { State } from '../redux/reducers';
import { logIn } from '../redux/auth/actions';
import LoginComponent from '../components/login';

export interface LoginStateToProps {
    user: User | null;
    loggingIn: boolean;
    loginError: { code: string, message: string } | null;
}

export interface LoginDispatchToProps {
    logIn: (username: string, password: string) => void;
}

const mapStateToProps = (state: State): LoginStateToProps => ({
    user: state.auth.user,
    loggingIn: state.auth.loggingIn,
    loginError: state.auth.error,
});

const mapDispatchToProps = (dispatch: any): LoginDispatchToProps => ({
    logIn: (username: string, password: string) => dispatch(logIn(username, password)),
});

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent as any); //TODO ?
export const Component = Login;
