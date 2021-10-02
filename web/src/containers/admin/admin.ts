import { User } from 'firebase/auth'
import { connect } from 'react-redux'
import { State } from '../../redux/reducers'
import { logOut } from '../../redux/auth/actions'
import AdminComponent from '../../components/admin/admin'

export interface AdminStateToProps {
  user: User
  darkMode: boolean
}

export interface AdminDispatchToProps {
  logOut: () => void
}

const mapStateToProps = (state: State): AdminStateToProps => ({
  user: state.auth.user!,
  darkMode: state.effects.darkMode,
})

const mapDispatchToProps = (dispatch: any): AdminDispatchToProps => ({
  logOut: () => dispatch(logOut()),
})

export const Admin = connect(mapStateToProps, mapDispatchToProps)(AdminComponent)
export default Admin
