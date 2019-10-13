/// <reference types="react-scripts" />

declare module 'debounce' {
    type CancelableFunction<T extends Function> = T & { clear: () => void, flush: () => void }

    export function debounce<T extends Function>(fun: T, wait: number, immediate?: boolean): CancelableFunction<T>
}
