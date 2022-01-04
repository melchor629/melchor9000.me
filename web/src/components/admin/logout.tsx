import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import type { LogoutDispatchToProps, LogoutStateToProps } from '../../containers/admin/logout'

const LogoutPage = ({ logOut }: LogoutStateToProps & LogoutDispatchToProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    logOut()
    navigate('/', { replace: true })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default LogoutPage
