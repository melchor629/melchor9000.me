import { User } from '@firebase/auth-types';
import { connect } from 'react-redux';
import { State } from 'src/redux/reducers';
import { changeTitle } from 'src/redux/title/actions';
import { logIn } from 'src/redux/auth/actions';
import LoginComponent from 'src/components/login';

export interface LoginStateToProps {
    user: User | null;
    loggingIn: boolean;
    loginError: { code: string, message: string } | null;
}

export interface LoginDispatchToProps {
    logIn: (username: string, password: string) => void;
    changeTitle: (title: string) => void;
}

const mapStateToProps = (state: State): LoginStateToProps => ({
    user: state.auth.user,
    loggingIn: state.auth.loggingIn,
    loginError: state.auth.error,
});

const mapDispatchToProps = (dispatch: any): LoginDispatchToProps => ({
    logIn: (username: string, password: string) => dispatch(logIn(username, password)),
    changeTitle: (title: string) => dispatch(changeTitle(title)),
});

export const Login = connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
export const Component = Login;
