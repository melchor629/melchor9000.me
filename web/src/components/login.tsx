import * as React from 'react'
import { Redirect, RouteComponentProps, StaticContext } from 'react-router'
import { animated, Spring } from 'react-spring/renderprops'
import { Helmet } from 'react-helmet'
import * as toast from '../lib/toast'
import type { LoginDispatchToProps, LoginStateToProps } from '../containers/login'
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

interface LoginPageState {
  username: string
  password: string
  canRedirect: boolean
}

type LoginPageProps = LoginStateToProps
& LoginDispatchToProps
& RouteComponentProps<{}, StaticContext, { from: { pathname: string } } | null | undefined>

export default class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props)
    this.state = {
      username: '',
      password: '',
      canRedirect: !!props.user,
    }
    this.usernameChanged = this.usernameChanged.bind(this)
    this.passwordChanged = this.passwordChanged.bind(this)
    this.buttonPressed = this.buttonPressed.bind(this)
  }

  componentDidUpdate(prevProps: Readonly<LoginStateToProps & LoginDispatchToProps>): void {
    const { loginError, user } = this.props
    if (!prevProps.loginError && loginError) {
      toast.error(loginError.message)
    }

    if (!prevProps.user && user) {
      setTimeout(() => {
        this.setState({ canRedirect: true })
      }, 2000)
    }
  }

  private usernameChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: e.target.value })
  }

  private passwordChanged(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: e.target.value })
  }

  private buttonPressed(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    const { logIn } = this.props
    const { username, password } = this.state
    logIn(username, password)
  }

  render() {
    const { location, loggingIn, user } = this.props
    const { canRedirect, username, password } = this.state

    if (user && canRedirect) {
      const to = { pathname: (location.state || { from: { pathname: '/' } }).from.pathname }
      return <Redirect to={to} />
    }

    const form = ({ alpha }: any) => (
      <animated.div style={{
        transform: alpha.interpolate((x: number) => `translate3d(${(1 - x) * -100}px,0,0)`),
        opacity: alpha.interpolate((x: number) => `${x}`),
      }}
      >
        <h1 className="h3 mb-3 font-weight-normal">Demuestrame quien eres</h1>
        <label htmlFor="inputEmail" className="sr-only">
          Email address
          <input
            type="email"
            id="inputEmail"
            className="form-control"
            placeholder="Correo electrónico"
            required
            style={emailInputStyle}
            value={username}
            onChange={this.usernameChanged}
          />
        </label>
        <label htmlFor="inputPassword" className="sr-only">
          Password
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Contraseña"
            required
            style={passwordInputStyle}
            value={password}
            onChange={this.passwordChanged}
          />
        </label>
        <button
          className="btn btn-lg btn-primary btn-block"
          type="submit"
          onClick={this.buttonPressed}
        >
          Dale
        </button>
      </animated.div>
    )

    const loading = ({ alpha }: any) => (
      <animated.div style={{
        transform: alpha.interpolate((x: number) => `translate3d(${(1 - x) * 100}px,0,0)`),
        opacity: alpha.interpolate((x: number) => `${x}`),
        position: 'relative',
        top: -187,
        zIndex: -1,
      }}
      >
        <h1 className="h3 mb-3 font-weight-normal">Comprobando...</h1>
        <LoadSpinner />
      </animated.div>
    )

    const salutation = (style: React.CSSProperties) => (
      <div style={{
        ...style, position: 'relative', top: -150, transform: `scale(${style.opacity!})`,
      }}
      >
        <h1 className="h3 mb-3 font-weight-normal">
          Bienvenido
          {user!.displayName}
        </h1>
      </div>
    )

    return (
      <div className="d-flex align-items-center justify-content-center text-center" style={containerStyle}>

        <Helmet>
          <title>Log out</title>
        </Helmet>

        <form style={formStyle}>
          <img
            className="mb-4"
            src={`${process.env.PUBLIC_URL}/ico/favicon.png`}
            style={{ width: 64 }}
            alt="favicon"
          />
          <Spring
            native
            from={{ alpha: 1 }}
            to={{ alpha: loggingIn || user ? 0 : 1 }}
          >
            {!user ? form : () => (<animated.div />)}
          </Spring>
          <Spring
            native
            from={{ alpha: 0 }}
            to={{ alpha: loggingIn && !user ? 1 : 0 }}
          >
            { loading }
          </Spring>
          <Spring from={{ opacity: 0 }} to={{ opacity: user ? 1 : 0 }}>
            {user ? salutation : () => (<div />)}
          </Spring>
        </form>
      </div>
    )
  }
}
