import {
  useSelector as useSelectorOriginal,
  useDispatch as useDispatchOriginal,
  TypedUseSelectorHook,
} from 'react-redux'
import type { Dispatch, State } from './store'

export const useSelector: TypedUseSelectorHook<State> = useSelectorOriginal
export const useDispatch = () => useDispatchOriginal<Dispatch>()
