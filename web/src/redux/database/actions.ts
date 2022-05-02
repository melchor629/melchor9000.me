import {
  getFirestore, collection, onSnapshot, query, orderBy, where, addDoc, doc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { Dispatch } from 'redux'
import app from '../../lib/firebase'
import databaseSlice from './slice'
import { ID, CollectionData } from './state'

export const { unsubscribe, removeError } = databaseSlice.actions
const {
  change,
  error,
  operationDoing,
  operationDone,
  subscribe: leSubscribe,
} = databaseSlice.actions

export const subscribe = (
  collectionName: string,
  orderByField: string | null = null,
  filters: [string, '<' | '>' | '<=' | '>=' | '==' | '!=', any][] | null = null,
) => (dispatch: Dispatch<any>) => {
  const db = getFirestore(app)
  let collectionQuery = query(collection(db, collectionName))

  if (orderByField !== null) {
    if (orderByField[0] === '-') {
      collectionQuery = query(collectionQuery, orderBy(orderByField.substr(1), 'desc'))
    } else {
      collectionQuery = query(collectionQuery, orderBy(orderByField, 'asc'))
    }

    (filters ?? []).forEach(([field, op, value]) => {
      collectionQuery = query(collectionQuery, where(field, op, value))
    })
  }

  dispatch(leSubscribe({
    collection: collectionName,
    unsubscribe: onSnapshot(
      collectionQuery,
      (snapshot) => dispatch(change({ collection: collectionName, snapshot })),
      (e) => dispatch(error({ collection: collectionName, error: e, operation: 'SUBSCRIPTION' })),
    ),
  }))
}

export const insert = (
  collectionName: string,
  { [ID]: id, ...values }: CollectionData,
) => (
  async (dispatch: Dispatch) => {
    const db = getFirestore(app)
    const col = collection(db, collectionName)
    dispatch(operationDoing({ collection: collectionName }))

    try {
      await addDoc(col, values)
      dispatch(operationDone({ collection: collectionName }))
    } catch (e) {
      dispatch(error({
        collection: collectionName,
        error: e as any,
        operation: 'INSERT',
      }))
    }
  }
)

export const update = (collectionName: string, { [ID]: id, ...values }: CollectionData) => (
  async (dispatch: Dispatch<any>) => {
    const db = getFirestore(app)
    const col = collection(db, collectionName)
    const document = doc(col, id)
    dispatch(operationDoing({ collection: collectionName }))

    try {
      await updateDoc(document, values)
      dispatch(operationDone({ collection: collectionName }))
    } catch (e) {
      dispatch(error({
        collection: collectionName,
        error: e as any,
        operation: 'UPDATE',
      }))
    }
  }
)

export const remove = (collectionName: string, { [ID]: id }: CollectionData) => (
  async (dispatch: Dispatch<any>) => {
    const db = getFirestore(app)
    const col = collection(db, collectionName)
    const document = doc(col, id)
    dispatch(operationDoing({ collection: collectionName }))

    try {
      await deleteDoc(document)
      dispatch(operationDone({ collection: collectionName }))
    } catch (e) {
      dispatch(error({
        collection: collectionName,
        error: e as any,
        operation: 'DELETE',
      }))
    }
  }
)
