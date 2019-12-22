/// <reference types="react-scripts" />

declare module 'debounce' {
    type CancelableFunction<T extends Function> = T & { clear: () => void, flush: () => void }

    export function debounce<T extends Function>(fun: T, wait: number, immediate?: boolean): CancelableFunction<T>
}

declare module NodeJS {
    interface ProcessEnv {
        readonly REACT_APP_FLICKR_API_KEY?: string
        readonly REACT_APP_FLICKR_SECRET_KEY?: string
        readonly REACT_APP_FIREBASE_API_KEY?: string
        readonly REACT_APP_FIREBASE_AUTH_DOMAIN?: string
        readonly REACT_APP_FIREBASE_DATABASE_URL?: string
        readonly REACT_APP_FIREBASE_PROJECT_ID?: string
        readonly REACT_APP_FIREBASE_STORAGE_BUCKET?: string
        readonly REACT_APP_FIREBASE_MESSAGING_SENDER_ID?: string
        readonly REACT_APP_FIREBASE_APP_ID?: string
    }
}
