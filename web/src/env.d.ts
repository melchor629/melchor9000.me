/// <reference types="vite/client" />

declare module 'debounce' {
    type CancelableFunction<T extends Function> = T & { clear: () => void, flush: () => void }

    // eslint-disable-next-line import/prefer-default-export
    export function debounce<T extends Function>(
      fun: T,
      wait: number,
      immediate?: boolean,
    ): CancelableFunction<T>
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_DATABASE_URL?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Document {
  webkitExitFullscreen?: () => void
  webkitCancelFullScreen?: () => void
  webkitFullscreenElement?: Element
  onwebkitfullscreenchange?: (() => void) | null
}

interface HTMLElement {
  webkitRequestFullScreen?: () => void
  webkitRequestFullscreen?: () => void
}
