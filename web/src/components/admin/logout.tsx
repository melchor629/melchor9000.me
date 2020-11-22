import { useEffect } from 'react'
import { Redirect } from 'react-router'
import type { LogoutDispatchToProps, LogoutStateToProps } from '../../containers/admin/logout'

const LogoutPage = ({ logOut }: LogoutStateToProps & LogoutDispatchToProps) => {
  useEffect(() => {
    logOut()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Redirect to="/" />
  )
}

export default LogoutPage
