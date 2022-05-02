import { User } from 'firebase/auth'
import { connect } from 'react-redux'
import { State } from '../../redux/store'
import { logOut } from '../../redux/auth/actions'
import LogoutComponent from '../../components/admin/logout'

export interface LogoutStateToProps {
  user: User | null
}

export interface LogoutDispatchToProps {
  logOut: () => void
}

const mapStateToProps = (state: State): LogoutStateToProps => ({ user: state.auth.user })

const mapDispatchToProps = (dispatch: any): LogoutDispatchToProps => ({
  logOut: () => dispatch(logOut()),
})

export const Logout = connect(mapStateToProps, mapDispatchToProps)(LogoutComponent)
