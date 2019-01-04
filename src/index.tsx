import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import Footer from './Footer';
import registerServiceWorker from './registerServiceWorker';
import i18n from './i18n';

import 'font-awesome/css/font-awesome.css';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

firebase.initializeApp({
    apiKey: 'AIzaSyCCu7x7WKTpZkWAtc4Z0HZTm8iJE5gl1cU',
    authDomain: 'melchor9000-me.firebaseapp.com',
    databaseURL: 'https://melchor9000-me.firebaseio.com',
    projectId: 'melchor9000-me',
    storageBucket: 'melchor9000-me.appspot.com',
    messagingSenderId: '528436151518'
});

(async () => {
    try {
        const fs = firebase.firestore();
        fs.settings({ timestampsInSnapshots: true });
        await fs.enablePersistence({ experimentalTabSynchronization: true });
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    } catch(error) {
        console.error(error);
    }

    require('bootstrap');

    //Do after initializing firestore, if not, app will crash
    const _compose = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
    const store = createStore(
        require('./redux/reducers').reducers,
        { title: { base: 'The Abode of melchor9000' } },
        _compose(applyMiddleware(thunk))
    );

    await new Promise((accept) => setTimeout(accept, 10));

    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <I18nextProvider i18n={ i18n }>
                    <App/>
                </I18nextProvider>
            </BrowserRouter>
        </Provider>,
        document.getElementById('root')
    );

    ReactDOM.render(
        <Footer />,
        document.getElementById('footer')
    );

    registerServiceWorker();
})();
