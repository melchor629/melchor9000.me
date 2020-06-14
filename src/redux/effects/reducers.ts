import {
    CHANGE_NAVBAR_HIDE_MODE,
    CHANGE_VISUALIZATION,
    DO_A_BARREL_ROLL,
    FLIP_IT,
    TOGGLE_DARK_MODE,
} from './actions'

export interface EffectsState {
    barrelRoll: boolean
    flipIt: boolean | null
    darkMode: boolean
    visualizationMode: null | 'bars' | 'wave' | 'random'
    navbarHideMode: 'top-only' | 'always' | null
}

export const effects = (state: EffectsState | undefined, action: any): EffectsState => {
    if(state === undefined) {
        let darkModeStored: boolean | null = JSON.parse(window.localStorage.getItem('melchor9000:darkMode') || 'null')
        if(darkModeStored === null && 'matchMedia' in window) {
            const matches = window.matchMedia('screen and (prefers-color-scheme: dark)')
            darkModeStored = matches.matches
        } else if(darkModeStored === null) {
            darkModeStored = false
        }

        state = {
            barrelRoll: false,
            flipIt: null,
            darkMode: darkModeStored,
            visualizationMode: null,
            navbarHideMode: null,
        }
    }

    switch(action.type) {
        case DO_A_BARREL_ROLL: return { ...state, barrelRoll: action.value }
        case FLIP_IT: return { ...state, flipIt: action.value }
        case TOGGLE_DARK_MODE: {
            window.localStorage.setItem('melchor9000:darkMode', JSON.stringify(!state.darkMode))
            return { ...state, darkMode: !state.darkMode }
        }
        case CHANGE_VISUALIZATION: {
            switch(state.visualizationMode) {
                case null: return { ...state, visualizationMode: 'bars' }
                case 'bars': return { ...state, visualizationMode: 'wave' }
                case 'wave': return { ...state, visualizationMode: 'random' }
                case 'random': return { ...state, visualizationMode: null }
                default: return state
            }
        }
        case CHANGE_NAVBAR_HIDE_MODE: {
            return { ...state, navbarHideMode: action.mode }
        }
        default: return state
    }
}
