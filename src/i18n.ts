import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import moment from 'moment'

import 'moment/locale/es'
import 'moment/locale/ca'

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        ns: [ 'translations' ],
        defaultNS: 'translations',
        debug: process.env.NODE_ENV !== 'production',
        interpolation: { escapeValue: false },
        react: { wait: true },
    })
    .then(() => moment.locale(i18n.language))

export default i18n
