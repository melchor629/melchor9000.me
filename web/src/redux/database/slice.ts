import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  Unsubscribe,
} from 'firebase/firestore'
import { ID, initialState } from './state'

const noop = () => {}

const ensureCreated = (state: typeof initialState, collection: string) => {
  if (!state[collection]) {
    state[collection] = {
      error: null,
      snapshot: [],
      unsubscribe: noop,
    }
  }
}

type CollectionAction<P extends {} = {}> = PayloadAction<{ collection: string } & P>

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    subscribe: (state, { payload }: CollectionAction<{ unsubscribe: Unsubscribe }>) => {
      ensureCreated(state, payload.collection)
      state[payload.collection].doing = false
      state[payload.collection].unsubscribe = payload.unsubscribe
    },
    unsubscribe: {
      reducer: (state, { payload }: CollectionAction) => {
        ensureCreated(state, payload.collection)
        state[payload.collection].unsubscribe()
        state[payload.collection].unsubscribe = noop
      },
      prepare: (collection: string) => ({ payload: { collection } }),
    },
    change: (state, { payload }: CollectionAction<{ snapshot: QuerySnapshot<DocumentData> }>) => {
      ensureCreated(state, payload.collection)
      const snapshot: Array<DocumentData & { [ID]: string }> = []
      payload.snapshot.forEach((doc) => {
        snapshot.push({ ...doc.data(), [ID]: doc.id })
      })
      state[payload.collection].snapshot = snapshot
    },
    error: (state, { payload }: CollectionAction<{ error: FirestoreError, operation: string }>) => {
      ensureCreated(state, payload.collection)
      state[payload.collection].error = payload.error
      state[payload.collection].doing = false
    },
    operationDoing: (state, { payload }: CollectionAction) => {
      ensureCreated(state, payload.collection)
      state[payload.collection].doing = true
      state[payload.collection].error = null
    },
    operationDone: (state, { payload }: CollectionAction) => {
      ensureCreated(state, payload.collection)
      state[payload.collection].doing = false
    },
    removeError: {
      reducer: (state, { payload }: CollectionAction) => {
        ensureCreated(state, payload.collection)
        state[payload.collection].error = null
      },
      prepare: (collection: string) => ({ payload: { collection } }),
    },
  },
})

export default databaseSlice
