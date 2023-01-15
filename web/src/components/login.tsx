import { animated, Spring } from '@react-spring/web'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { shallowEqual } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import * as toast from '../lib/toast'
import { useDispatch, useSelector } from '../redux'
import { logIn } from '../redux/auth/actions'
import LoadSpinner from './load-spinner'

const formStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 333,
}

const containerStyle: React.CSSProperties = { width: '100%' }

const emailInputStyle: React.CSSProperties = {
  marginBottom: -1,
  borderBottomRightRadius: 0,
  borderBottomLeftRadius: 0,
}

const passwordInputStyle: React.CSSProperties = {
  borderTopRightRadius: 0,
  borderTopLeftRadius: 0,
  marginBottom: 15,
}

const LoginPage = () => {
  const [user, loggingIn, loginError] = useSelector(
    ({ auth }) => [auth.user, auth.loggingIn, auth.error] as const,
    shallowEqual,
  )
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [canRedirect, setCanRedirect] = useState(!!user)
  const location = useLocation()
  const navigate = useNavigate()

  const usernameChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }, [])

  const passwordChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  const buttonPressed = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(logIn(username, password))
  }, [dispatch, username, password])

  useEffect(() => {
    if (loginError) {
      toast.error(loginError.message)
    }
  }, [loginError])

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setCanRedirect(true)
      }, 2000)
    }
  }, [user])

  useEffect(() => {
    if (user && canRedirect) {
      const state: { from?: { pathname?: string } } = location.state as any
      const to = { pathname: state?.from?.pathname ?? '/' }
      navigate(to)
    }
  }, [user, canRedirect, location.state, navigate])

  if (user && canRedirect) {
    return null
  }

  const form = ({ alpha }: any) => (
    <animated.div style={{
      transform: alpha.to((x: number) => `translate3d(${(1 - x) * -100}px,0,0)`),
      opacity: alpha.to((x: number) => `${x}`),
    }}
    >
      <h1 className="h3 mb-3 font-weight-normal">Demuestrame quien eres</h1>
      <div className="form-floating">
        <input
          type="email"
          id="inputEmail"
          className="form-control"
          placeholder="Correo electrónico"
          required
          style={emailInputStyle}
          value={username}
          onChange={usernameChanged}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="inputEmail">
          Email address
        </label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          id="inputPassword"
          className="form-control"
          placeholder="Contraseña"
          required
          autoComplete=""
          style={passwordInputStyle}
          value={password}
          onChange={passwordChanged}
        />
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="inputPassword">
          Password
        </label>
      </div>
      <button
        className="btn btn-lg btn-primary btn-block"
        type="submit"
        onClick={buttonPressed}
      >
        Dale
      </button>
    </animated.div>
  )

  const loading = ({ alpha }: any) => (
    <animated.div style={{
      transform: alpha.to((x: number) => `translate3d(${(1 - x) * 100}px,0,0)`),
      opacity: alpha.to((x: number) => `${x}`),
      position: 'relative',
      top: -187,
      zIndex: -1,
    }}
    >
      <h1 className="h3 mb-3 font-weight-normal">Comprobando...</h1>
      <LoadSpinner />
    </animated.div>
  )

  const salutation = (style: any) => (
    <animated.div style={{
      ...style,
      position: 'relative',
      top: -150,
      transform: style.opacity.to((x: number) => `scale(${x})`),
    }}
    >
      <h1 className="h3 mb-3 font-weight-normal">
        Bienvenido
        {user!.displayName}
      </h1>
    </animated.div>
  )

  return (
    <div className="d-flex align-items-center justify-content-center text-center" style={containerStyle}>

      <Helmet>
        <title>Log out</title>
      </Helmet>

      <form style={formStyle}>
        <img
          className="mb-4"
          src={new URL('../ico/favicon.png', import.meta.url).toString()}
          style={{ width: 64 }}
          alt="favicon"
        />
        <Spring
          from={{ alpha: 1 }}
          to={{ alpha: loggingIn || user ? 0 : 1 }}
        >
          {!user ? form : () => (<animated.div />)}
        </Spring>
        <Spring
          from={{ alpha: 0 }}
          to={{ alpha: loggingIn && !user ? 1 : 0 }}
        >
          { loading }
        </Spring>
        <Spring from={{ opacity: 0 }} to={{ opacity: user ? 1 : 0 }}>
          {user ? salutation : () => (<animated.div />)}
        </Spring>
      </form>
    </div>
  )
}

export default LoginPage
