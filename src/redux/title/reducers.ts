import { AnyAction } from 'redux';
import { CHANGE_TITLE } from './actions';

export interface TitleState {
    title: string;
    base: string;
    part: string | null;
}

export const title = (state: TitleState = { title: '', base: '', part: null }, action: AnyAction) => {
    switch(action.type) {
        case CHANGE_TITLE: {
            let newTitle;
            if(action.title) {
                newTitle = `${action.title} - ${state.base}`;
            } else {
                newTitle = state.base;
            }
            document.title = newTitle;
            return { ...state, part: action.title, title: newTitle };
        }

        default: return state;
    }
};