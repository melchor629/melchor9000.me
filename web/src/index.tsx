import * as firebaseAuth from 'firebase/auth'
import { Suspense, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import 'bootstrap'

import App from './App'
import Footer from './Footer'
import i18n from './i18n'
import LoadingSpinner from './components/load-spinner'
import reportWebVitals from './report-web-vitals'
import firebaseApp from './lib/firebase';

(async () => {
  try {
    await firebaseAuth.getAuth(firebaseApp).setPersistence({ type: 'SESSION' })
  } catch (error) {
    console.error(error)
  }

  // @ts-ignore - Do after initializing firestore, if not, app will crash
  const reduxCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    (await import('./redux/reducers')).reducers,
    {},
    reduxCompose(applyMiddleware(thunk)),
  )

  await new Promise((accept) => setTimeout(accept, 10))

  ReactDOM.render(
    (
      <StrictMode>
        <Provider store={store}>
          <BrowserRouter>
            <Suspense fallback={LoadingSpinner}>
              <I18nextProvider i18n={i18n}>
                <App />
              </I18nextProvider>
            </Suspense>
          </BrowserRouter>
        </Provider>
      </StrictMode>
    ),
    document.getElementById('root'),
  )
})()

ReactDOM.render(
  <Footer />,
  document.getElementById('footer'),
)

// https://bit.ly/CRA-vitals
reportWebVitals((e) => {
  console.log('web-vitals', e)
})
