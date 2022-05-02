import clsx from 'clsx'
import {
  useCallback, useLayoutEffect, useRef, useState, MouseEvent, KeyboardEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { shallowEqual } from 'react-redux'
import { useMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { useSelector } from '../redux'

const NavbarLink = ({ route }: any) => {
  const [t] = useTranslation()
  const match = useMatch(`${route}/*`)

  return (
    <li className={clsx('nav-item', match && 'active')} key={route.route}>
      <Link
        to={route}
        className="nav-link"
      >
        {t(`${route.substr(1)}.title`, { defaultValue: route.substr(1) })}
      </Link>
    </li>
  )
}

const Navbar = () => {
  const navbarHideMode = useSelector(({ effects }) => effects.navbarHideMode, shallowEqual)
  const [offcanvas, setOffcanvas] = useState(false)
  const [navbarExtraClases, setNavbarExtraClasses] = useState<string[]>([])
  const navbarThresholdRef = useRef<HTMLDivElement>(null)

  const toggleNavigation = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setOffcanvas((value) => !value)
  }, [])

  const closeOffcanvasIfLinkClicked = useCallback(
    (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
      if (e.currentTarget.nodeName === 'A') {
        setOffcanvas(false)
      }
    },
    [],
  )

  useLayoutEffect(() => {
    if (navbarHideMode === null) {
      setNavbarExtraClasses((c) => (c.length ? [] : c))
    } else if (navbarHideMode === 'top-only') {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNavbarExtraClasses(['hide-top'])
        } else {
          setNavbarExtraClasses([])
        }
      })
      observer.observe(navbarThresholdRef.current!)

      return () => {
        observer.disconnect()
      }
    } else if (navbarHideMode === 'always') {
      setNavbarExtraClasses((c) => (c.includes('hide') ? c : ['hide']))
    }

    return () => {}
  }, [navbarHideMode])

  return (
    <>
      <div style={{ position: 'absolute', top: 125 }} ref={navbarThresholdRef} />

      <nav className={clsx('navbar navbar-default navbar-dark navbar-expand-lg fixed-top', navbarExtraClases)}>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavigation}
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <Link className="navbar-brand" to="/">The Abode of melchor9000</Link>

          <div
            className={`collapse navbar-collapse offcanvas-collapse ${offcanvas ? 'open' : ''}`}
            id="navbarSupportedContent"
          >
            <ul
              className="navbar-nav mr-auto"
              role="presentation"
              onClick={closeOffcanvasIfLinkClicked}
              onKeyPress={closeOffcanvasIfLinkClicked}
            >
              <NavbarLink route="/" />
              <NavbarLink route="/about-me" />
              <NavbarLink route="/gallery" />
              <NavbarLink route="/blog" />
              <NavbarLink route="/projects" />
              <NavbarLink route="/experiments" />
              <NavbarLink route="/support-me" />
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
