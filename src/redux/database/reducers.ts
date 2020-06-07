import { QueryDocumentSnapshot } from '@firebase/firestore-types'
import {
    CHANGE,
    CLEAR_ERROR,
    OPERATION_DOING,
    OPERATION_DONE,
    OPERATION_ERROR,
    SUBSCRIPTION,
    SUBSCRIPTION_ERROR,
    UNSUBSCRIBE,
} from './actions'

export interface DatabaseState {
    subscriptions: any
    snapshots: { [index: string]: any }
    errors: { [index: string]: any }
    doing: { [index: string]: boolean | undefined }
}

export const database = (state: DatabaseState | undefined, action: any): DatabaseState => {
    if(!state) {
        state = {
            subscriptions: {},
            snapshots: {},
            errors: {},
            doing: {},
        }
    }

    switch(action.type) {
        case SUBSCRIPTION: {
            return {
                ...state,
                subscriptions: { ...state.subscriptions, [action.collection]: action.subscription },
                doing: { ...state.doing, [action.collection]: false },
            }
        }

        case UNSUBSCRIBE: {
            state.subscriptions[action.collection]()
            const newSubscriptions = { ...state.subscriptions }
            delete newSubscriptions[action.collection]
            return { ...state, subscriptions: newSubscriptions }
        }

        case CHANGE: {
            const snapshot: any[] = []
            action.snapshot.forEach((doc: QueryDocumentSnapshot) => {
                snapshot.push({ ...doc.data(), _id: doc.id })
            })
            return { ...state, snapshots: { ...state.snapshots, [action.collection]: snapshot } }
        }

        case SUBSCRIPTION_ERROR:
            return { ...state, errors: { ...state.errors, [action.collection]: action.error } }

        case OPERATION_DOING:
            return {
                ...state,
                doing: { ...state.doing, [action.collection]: true },
            }

        case OPERATION_DONE:
            return {
                ...state,
                doing: { ...state.doing, [action.collection]: false },
            }

        case OPERATION_ERROR:
            return {
                ...state,
                errors: { ...state.errors, [action.collection]: action.error },
                doing: { ...state.doing, [action.collection]: false },
            }

        case CLEAR_ERROR: {
            const newErrors = { ...state.errors }
            delete newErrors[action.collection]
            return { ...state, errors: newErrors }
        }

        default: return state
    }
}
