import { Dispatch } from '@reduxjs/toolkit'
import { State } from '../store'
import effectsSlice from './slice'

export const { changeNavbarHideMode, changeVisualization, toggleDarkMode } = effectsSlice.actions
const { changeBarrelRoll, changeFlipIt } = effectsSlice.actions

export const doABarrelRoll = () => (dispatch: Dispatch) => {
  dispatch(changeBarrelRoll(true))
  setTimeout(() => dispatch(changeBarrelRoll(false)), 4000)
}

export const flipIt = () => (dispatch: Dispatch, getState: () => State) => {
  const { effects: { flipIt: value } } = getState()
  if (value) {
    dispatch(changeFlipIt(false))
    setTimeout(() => dispatch(changeFlipIt(null)), 3000)
  } else {
    dispatch(changeFlipIt(true))
  }
}
