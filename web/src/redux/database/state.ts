import type { DocumentData, FirestoreError, Unsubscribe } from 'firebase/firestore'

export const ID = Symbol('collectin:id')

export type CollectionData<T extends DocumentData = DocumentData> = { [ID]: string } & T

interface CollectionState<T extends DocumentData = DocumentData> {
  unsubscribe: Unsubscribe
  snapshot: Array<CollectionData<T>>
  error: FirestoreError | null
  doing?: boolean
}

export type DatabaseState = Record<string, CollectionState>

export const initialState: DatabaseState = {}
