import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialState } from './state'

const effectsSlice = createSlice({
  name: 'effects',
  initialState,
  reducers: {
    changeBarrelRoll: (state, action: PayloadAction<boolean>) => {
      state.barrelRoll = action.payload
    },
    changeFlipIt: (state, action: PayloadAction<boolean | null>) => {
      state.flipIt = action.payload
    },
    toggleDarkMode: (state) => {
      window.localStorage.setItem('melchor9000:darkMode', JSON.stringify(!state.darkMode))
      state.darkMode = !state.darkMode
    },
    changeVisualization: (state) => {
      state.visualizationMode = {
        null: 'bars' as const,
        bars: 'wave' as const,
        wave: 'random' as const,
        random: null,
      }[`${state.visualizationMode}`]
    },
    changeNavbarHideMode: (state, action: PayloadAction<'top-only' | 'always' | null>) => {
      state.navbarHideMode = action.payload
    },
  },
})

export default effectsSlice
