import { FC, ReactElement, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSelector } from '../redux'

const PrivateRoute: FC<{ children: ReactElement }> = ({ children }) => {
  const loggedIn = useSelector(({ auth }) => !!auth.user)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login', { state: { from: location } })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn])

  if (!loggedIn) {
    return null
  }

  return children
}

export default PrivateRoute
