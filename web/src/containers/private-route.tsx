import { FC, ReactElement, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const PrivateRoute: FC<{ children: ReactElement }> = ({ children }) => {
  const loggedIn = useSelector(({ auth }) => !!auth.user)
  const location = useLocation()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!loggedIn) {
      navigate('/login', { state: { from: location } })
    }
  })

  if (!loggedIn) {
    return null
  }

  return children
}

export default PrivateRoute
