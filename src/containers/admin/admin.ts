import { User } from '@firebase/auth-types';
import { connect } from 'react-redux';
import { State } from 'src/redux/reducers';
import { changeTitle } from 'src/redux/title/actions';
import { logOut } from 'src/redux/auth/actions';
import AdminComponent from 'src/components/admin/admin';

export interface AdminStateToProps {
    user: User;
}

export interface AdminDispatchToProps {
    logOut: () => void;
    changeTitle: (title: string) => void;
}

const mapStateToProps = (state: State): AdminStateToProps => ({
    user: state.auth.user!,
});

const mapDispatchToProps = (dispatch: any): AdminDispatchToProps => ({
    logOut: () => dispatch(logOut()),
    changeTitle: (title: string) => dispatch(changeTitle(title)),
});

export const Admin = connect(mapStateToProps, mapDispatchToProps)(AdminComponent);
export const Component = Admin;
