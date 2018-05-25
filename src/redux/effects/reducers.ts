import { CHANGE_VISUALIZATION, DO_A_BARREL_ROLL, FLIP_IT, TOGGLE_DARK_MODE } from './actions';

export interface EffectsState {
    barrelRoll: boolean;
    flipIt: boolean | null;
    darkMode: boolean;
    visualizationMode: null | 'bars' | 'wave' | 'random';
}

export const effects = (state: EffectsState = {
    barrelRoll: false,
    flipIt: null,
    darkMode: JSON.parse(window.localStorage.getItem('darkMode') || 'false'),
    visualizationMode: null
},                      action: { type: string, value?: any }) => {
    switch(action.type) {
        case DO_A_BARREL_ROLL: return { ...state, barrelRoll: action.value };
        case FLIP_IT: return { ...state, flipIt: action.value };
        case TOGGLE_DARK_MODE: {
            window.localStorage.setItem('darkMode', String(!state.darkMode));
            return { ...state, darkMode: !state.darkMode };
        }
        case CHANGE_VISUALIZATION: {
            switch(state.visualizationMode) {
                case null: return { ...state, visualizationMode: 'bars' };
                case 'bars': return { ...state, visualizationMode: 'wave' };
                case 'wave': return { ...state, visualizationMode: 'random' };
                case 'random': return { ...state, visualizationMode: null };
                default: return state;
            }
        }
        default: return state;
    }
};