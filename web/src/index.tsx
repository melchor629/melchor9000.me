import * as firebaseAuth from 'firebase/auth'
import { Suspense, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'

import App from './App'
import Footer from './Footer'
import i18n from './i18n'
import LoadingSpinner from './components/load-spinner'
import firebaseApp from './lib/firebase'

const appRoot = createRoot(document.getElementById('root')!, { identifierPrefix: 'app' })
const footerRoot = createRoot(document.getElementById('footer')!, { identifierPrefix: 'footer' });

(async () => {
  try {
    await firebaseAuth.getAuth(firebaseApp).setPersistence(firebaseAuth.browserSessionPersistence)
  } catch (error) {
    console.error(error)
  }

  const { default: store } = await import('./redux/store')

  appRoot.render(
    (
      <StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <HelmetProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <I18nextProvider i18n={i18n}>
                  <App />
                </I18nextProvider>
              </Suspense>
            </HelmetProvider>
          </BrowserRouter>
        </Provider>
      </StrictMode>
    ),
  )
})()

footerRoot.render(<StrictMode><Footer /></StrictMode>)
