import { State } from '../../redux/reducers';
import { changeTitle } from '../../redux/title/actions';
import { logOut } from '../../redux/auth/actions';
import { connect } from 'react-redux';
import AdminComponent from '../../components/admin/admin';
import { User } from '@firebase/auth-types';

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
