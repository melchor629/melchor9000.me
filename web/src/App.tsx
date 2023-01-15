import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { Helmet } from 'react-helmet-async'

import Navbar from './components/navbar'
import AppRoutes from './routes'
import { useSelector } from './redux'

import './app.scss'
import { publicUrl } from './lib/url'

const App = () => {
  const {
    barrelRoll, flipIt, darkMode,
  } = useSelector(({ effects }) => ({
    barrelRoll: effects.barrelRoll,
    flipIt: effects.flipIt,
    darkMode: effects.darkMode,
  }))

  useEffect(() => {
    if (flipIt === null) {
      document.body.classList.remove('iflip')
    } else if (flipIt) {
      document.body.classList.add('flip')
    } else {
      document.body.classList.add('iflip')
      document.body.classList.remove('flip')
    }
  }, [flipIt])

  useEffect(() => {
    if (barrelRoll) {
      document.body.classList.add('barrel-roll')
    } else {
      document.body.classList.remove('barrel-roll')
    }
  }, [barrelRoll])

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('darkmode')
    } else {
      document.body.classList.remove('darkmode')
    }
  }, [darkMode])

  return (
    <div className="wrap">

      <Helmet
        titleTemplate="%s - The abode of melchor9000"
        defaultTitle="The abode of melchor9000"
      >
        <base href={publicUrl} />
        <meta
          name="Description"
          content="The abode of melchor9000 - Personal webpage for Melchor Alejo Garau Madrigal
                        (aka melchor9000, aka melchor629)"
        />
      </Helmet>

      <Navbar />
      <ToastContainer pauseOnHover={false} />
      <AppRoutes />

    </div>
  )
}
// https://reactrouter.com/docs/en/v6/upgrading/v5

export default App
