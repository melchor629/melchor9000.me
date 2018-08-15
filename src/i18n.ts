import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/ca';
const Backend = require('i18next-xhr-backend');
const LanguageDetector = require('i18next-browser-languagedetector');

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(reactI18nextModule)
    .init({
        fallbackLng: 'en',
        ns: ['translations'],
        defaultNS: 'translations',
        debug: process.env.NODE_ENV !== 'PRODUCTION',
        interpolation: {
            escapeValue: false,
        },
        react: {
            wait: true
        }
    }).on('initialized', () => moment.locale(i18n.language));

export default i18n;
