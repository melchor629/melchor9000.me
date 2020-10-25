/* eslint-disable no-underscore-dangle */
import firebase from 'firebase/app'
import { Dispatch } from 'redux'

export const SUBSCRIPTION = 'database:SUBSCRIPTION'
export const UNSUBSCRIBE = 'database:UNSUBSCRIBE'
export const CHANGE = 'database:CHANGE'
export const OPERATION_DOING = 'database:OP_DOING'
export const OPERATION_DONE = 'database:OP_DONE'
export const SUBSCRIPTION_ERROR = 'database:SUBSCRIPTION_ERROR'
export const OPERATION_ERROR = 'database:OPERATION_ERROR'
export const CLEAR_ERROR = 'database:CLEAR_ERROR'

export const subscribe = (
  collection: string,
  orderBy: string | null = null,
  filterOperator: '<' | '>' | '<=' | '>=' | null = null,
  filterValue: any | null = null,
) => (dispatch: Dispatch<any>) => {
  const db = firebase.firestore()
  let query: any = db.collection(collection)

  if (orderBy !== null) {
    if (orderBy[0] === '-') {
      // eslint-disable-next-line no-param-reassign
      orderBy = orderBy.substr(1)
      query = query.orderBy(orderBy, 'desc')
    } else {
      query = query.orderBy(orderBy, 'asc')
    }

    if (filterOperator !== null) {
      if (filterValue === null) {
        throw new Error('filter must have an value')
      }

      query = query.where(orderBy, filterOperator, filterValue)
    }
  }

  dispatch({
    type: SUBSCRIPTION,
    collection,
    subscription: query.onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
      dispatch({ type: CHANGE, collection, snapshot })
    }, (error: Error) => {
      dispatch({ type: SUBSCRIPTION_ERROR, collection, error })
    }),
  })
}

export const insert = (collection: string, values: any) => async (dispatch: Dispatch<any>) => {
  const db = firebase.firestore()
  const col = db.collection(collection)
  dispatch({ type: OPERATION_DOING, collection })

  try {
    const updatedValues = { ...values, _id: undefined }
    await col.add(updatedValues)
    dispatch({ type: OPERATION_DONE, collection })
  } catch (error) {
    dispatch({
      type: OPERATION_ERROR,
      collection,
      error,
      operation: 'INSERT',
    })
  }
}

export const update = (collection: string, object: any, merge: boolean = false) => (
  async (dispatch: Dispatch<any>) => {
    const db = firebase.firestore()
    const item = db.collection(collection).doc(object._id)
    dispatch({ type: OPERATION_DOING, collection })

    try {
      const updatedObject = { ...object, _id: undefined }
      await item.set(updatedObject, { merge })
      dispatch({ type: OPERATION_DONE, collection })
    } catch (error) {
      dispatch({
        type: OPERATION_ERROR,
        collection,
        error,
        operation: 'UPDATE',
      })
    }
  }
)

export const remove = (collection: string, object: any) => async (dispatch: Dispatch<any>) => {
  const db = firebase.firestore()
  const item = db.collection(collection).doc(object._id)
  dispatch({ type: OPERATION_DOING, collection })

  try {
    await item.delete()
    dispatch({ type: OPERATION_DONE, collection })
  } catch (error) {
    dispatch({
      type: OPERATION_ERROR,
      collection,
      error,
      operation: 'DELETE',
    })
  }
}

export const unsubscribe = (collection: string) => ({
  type: UNSUBSCRIBE,
  collection,
})

export const removeError = (collection: string) => ({
  type: CLEAR_ERROR,
  collection,
})
