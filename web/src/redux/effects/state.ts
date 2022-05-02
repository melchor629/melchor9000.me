export interface EffectsState {
  barrelRoll: boolean
  flipIt: boolean | null
  darkMode: boolean
  visualizationMode: null | 'bars' | 'wave' | 'random'
  navbarHideMode: 'top-only' | 'always' | null
}

export const initialState = (): EffectsState => {
  let darkModeStored: boolean | null = JSON.parse(window.localStorage.getItem('melchor9000:darkMode') || 'null')
  if (darkModeStored === null && 'matchMedia' in window) {
    const matches = window.matchMedia('screen and (prefers-color-scheme: dark)')
    darkModeStored = matches.matches
  } else if (darkModeStored === null) {
    darkModeStored = false
  }

  return {
    barrelRoll: false,
    flipIt: null,
    darkMode: darkModeStored,
    visualizationMode: null,
    navbarHideMode: null,
  }
}
