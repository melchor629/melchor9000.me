/* eslint-disable no-underscore-dangle */
import {
  getFirestore, collection, onSnapshot, query, orderBy, where, addDoc, doc, updateDoc, deleteDoc,
} from 'firebase/firestore'
import { Dispatch } from 'redux'
import app from '../../lib/firebase'

export const SUBSCRIPTION = 'database:SUBSCRIPTION'
export const UNSUBSCRIBE = 'database:UNSUBSCRIBE'
export const CHANGE = 'database:CHANGE'
export const OPERATION_DOING = 'database:OP_DOING'
export const OPERATION_DONE = 'database:OP_DONE'
export const SUBSCRIPTION_ERROR = 'database:SUBSCRIPTION_ERROR'
export const OPERATION_ERROR = 'database:OPERATION_ERROR'
export const CLEAR_ERROR = 'database:CLEAR_ERROR'

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

  const subscription = onSnapshot(
    collectionQuery,
    (snapshot) => dispatch({ type: CHANGE, collection: collectionName, snapshot }),
    (error) => dispatch({ type: SUBSCRIPTION_ERROR, collection: collectionName, error }),
  )

  dispatch({
    type: SUBSCRIPTION,
    collection: collectionName,
    subscription,
  })
}

export const insert = (collectionName: string, values: any) => async (dispatch: Dispatch<any>) => {
  const db = getFirestore(app)
  const col = collection(db, collectionName)
  dispatch({ type: OPERATION_DOING, collection: collectionName })

  try {
    const updatedValues = { ...values, _id: undefined }
    await addDoc(col, updatedValues)
    dispatch({ type: OPERATION_DONE, collection: collectionName })
  } catch (error) {
    dispatch({
      type: OPERATION_ERROR,
      collection: collectionName,
      error,
      operation: 'INSERT',
    })
  }
}

export const update = (collectionName: string, object: any) => (
  async (dispatch: Dispatch<any>) => {
    const db = getFirestore(app)
    const col = collection(db, collectionName)
    const document = doc(col, object._id)
    dispatch({ type: OPERATION_DOING, collection: collectionName })

    try {
      const updatedObject = { ...object, _id: undefined }
      await updateDoc(document, updatedObject)
      dispatch({ type: OPERATION_DONE, collection: collectionName })
    } catch (error) {
      dispatch({
        type: OPERATION_ERROR,
        collection: collectionName,
        error,
        operation: 'UPDATE',
      })
    }
  }
)

export const remove = (collectionName: string, object: any) => async (dispatch: Dispatch<any>) => {
  const db = getFirestore(app)
  const col = collection(db, collectionName)
  const document = doc(col, object._id)
  dispatch({ type: OPERATION_DOING, collection: collectionName })

  try {
    await deleteDoc(document)
    dispatch({ type: OPERATION_DONE, collection: collectionName })
  } catch (error) {
    dispatch({
      type: OPERATION_ERROR,
      collection: collectionName,
      error,
      operation: 'DELETE',
    })
  }
}

export const unsubscribe = (collectionName: string) => ({
  type: UNSUBSCRIBE,
  collection: collectionName,
})

export const removeError = (collectionName: string) => ({
  type: CLEAR_ERROR,
  collection: collectionName,
})
