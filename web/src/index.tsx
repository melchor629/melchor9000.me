import { Suspense, StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'
import firebase from 'firebase/app'
import { I18nextProvider } from 'react-i18next'
import 'bootstrap'

import App from './App'
import Footer from './Footer'
import * as serviceWorker from './serviceWorker'
import i18n from './i18n'
import LoadingSpinner from './components/load-spinner'
import reportWebVitals from './report-web-vitals'

import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/auth'
import 'firebase/storage'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

(async () => {
  try {
    const fs = firebase.firestore()
    fs.settings({ cacheSizeBytes: 4000 * 1000 })
    await fs.enablePersistence({ synchronizeTabs: true })
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
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

  ReactDOM.render(
    <Footer />,
    document.getElementById('footer'),
  )

  serviceWorker.unregister()

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals((e) => {
    console.log('web-vitals', e)
  })
})()
