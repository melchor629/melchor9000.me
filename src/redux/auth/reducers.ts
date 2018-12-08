import firebase from 'firebase/app';
import { User } from '@firebase/auth-types';
import { AnyAction } from 'redux';
import { LOG_IN_ERROR, LOGGING_IN, LOG_IN, LOG_OUT, LOG_OUT_ERROR } from './actions';

export interface AuthState {
    user: User | null;
    loggingIn: boolean;
    error: { code: string, message: string } | null;
}

export const auth = (state: AuthState | undefined, action: AnyAction): AuthState => {
    if(state === undefined) {
        return {
            user: firebase.auth().currentUser,
            loggingIn: false,
            error: null,
        };
    }
    
    switch(action.type) {
        case LOGGING_IN:
            return {
                ...state,
                error: null,
                loggingIn: true,
            };

        case LOG_IN:
            return {
                ...state,
                loggingIn: false,
                user: action.user,
            };

        case LOG_IN_ERROR:
            return {
                ...state,
                loggingIn: false,
                error: { message: action.message, code: action.code },
            };

        case LOG_OUT:
            return {
                ...state,
                user: null,
                error: null,
            };

        case LOG_OUT_ERROR:
            return {
                ...state,
                error: action.error
            };

        default: return state;
    }
};
