import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { State } from '../redux/store'
import {
  changeVisualization,
  doABarrelRoll,
  flipIt,
  toggleDarkMode,
} from '../redux/effects/actions'
import HomeComponent from '../components/home/home'

export interface IndexStateToProps {
  flipItValue: boolean | null
  darkMode: boolean
  visualizationMode: null | 'bars' | 'wave' | 'random'
}

export interface IndexDispatchToProps {
  doABarrelRoll: () => void
  flipIt: () => void
  toggleDarkMode: () => void
  changeVisualizationMode: () => void
}

const mapStateToProps = (state: State): IndexStateToProps => ({
  flipItValue: state.effects.flipIt,
  darkMode: state.effects.darkMode,
  visualizationMode: state.effects.visualizationMode,
})

const mapDispatchToProps = (dispatch: any): IndexDispatchToProps => ({
  doABarrelRoll: () => dispatch(doABarrelRoll()),
  flipIt: () => dispatch(flipIt()),
  toggleDarkMode: () => dispatch(toggleDarkMode()),
  changeVisualizationMode: () => dispatch(changeVisualization()),
})

export const Home = withTranslation('translations')(connect(mapStateToProps, mapDispatchToProps)(HomeComponent))
export default Home
