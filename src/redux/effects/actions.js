export const DO_A_BARREL_ROLL = 'effects:DO_A_BARREL_ROLL'
export const FLIP_IT = 'effects:FLIP_IT'
export const TOGGLE_DARK_MODE = 'effects:TOGGLE_DARK_MODE'
export const CHANGE_VISUALIZATION = 'effects:CHANGE_VISUALIZATION'
export const CHANGE_NAVBAR_HIDE_MODE = 'effects:CHANGE_NAVBAR_HIDE_MODE'

export const doABarrelRoll = () => dispatch => {
    dispatch({ type: DO_A_BARREL_ROLL, value: true })
    setTimeout(() => dispatch({ type: DO_A_BARREL_ROLL, value: false }), 4000)
}

export const flipIt = flipIt => dispatch => {
    if(flipIt) {
        dispatch({ type: FLIP_IT, value: false })
        setTimeout(() => dispatch({ type: FLIP_IT, value: null }), 3000)
    } else {
        dispatch({ type: FLIP_IT, value: true })
    }
}

export const toggleDarkMode = () => ({ type: TOGGLE_DARK_MODE })

export const changeVisualization = () => ({ type: CHANGE_VISUALIZATION })

export const changeNavbarHideMode = mode => ({
    type: CHANGE_NAVBAR_HIDE_MODE,
    mode,
})
