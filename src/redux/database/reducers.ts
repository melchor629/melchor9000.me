import { QueryDocumentSnapshot } from '@firebase/firestore-types';
import {
    SUBSCRIPTION,
    UNSUBSCRIBE,
    CHANGE,
    SUBSCRIPTION_ERROR,
    CLEAR_ERROR,
    OPERATION_ERROR,
    OPERATION_DOING,
    OPERATION_DONE,
} from './actions';

export interface DatabaseState {
    subscriptions: any;
    snapshots: any;
    errors: any;
    doing: any;
}

export const database = (state: DatabaseState, action: any): DatabaseState => {
    if(!state) {
        state = {
            subscriptions: {},
            snapshots: {},
            errors: {},
            doing: {},
        };
    }

    switch(action.type) {
        case SUBSCRIPTION: {
            return {
                ...state,
                subscriptions: { ...state.subscriptions, [action.collection]: action.subscription },
                doing: { ...state.doing, [action.collection]: false },
            };
        }

        case UNSUBSCRIBE: {
            state.subscriptions[action.collection]();
            let newSubscriptions = { ...state.subscriptions };
            delete newSubscriptions[action.collection];
            return { ...state, subscriptions: newSubscriptions };
        }

        case CHANGE: {
            let snapshot: any[] = [];
            action.snapshot.forEach((doc: QueryDocumentSnapshot) => {
                snapshot.push({ ...doc.data(), _id: doc.id });
            });
            return { ...state, snapshots: { ...state.snapshots, [action.collection]: snapshot } };
        }

        case SUBSCRIPTION_ERROR:
            return { ...state, errors: { ...state.errors, [action.collection]: action.error } };

        case OPERATION_DOING:
            return {
                ...state,
                doing: { ...state.doing, [action.collection]: true },
            };

        case OPERATION_DONE:
            return {
                ...state,
                doing: { ...state.doing, [action.collection]: false },
            };

        case OPERATION_ERROR:
            return {
                ...state,
                errors: { ...state.errors, [action.collection]: action.error },
                doing: { ...state.doing, [action.collection]: false },
            };

        case CLEAR_ERROR: {
            let newErrors = { ...state.errors };
            delete newErrors[action.collection];
            return { ...state, errors: newErrors };
        }

        default: return state;
    }
};