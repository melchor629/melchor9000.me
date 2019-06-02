import { connect } from 'react-redux';
import { State } from '../redux/reducers';
import { changeVisualization, doABarrelRoll, flipIt, toggleDarkMode } from '../redux/effects/actions';
import HomeComponent from '../components/home/home';
import { withTranslation } from 'react-i18next';

export interface IndexStateToProps {
    flipItValue: boolean | null;
    darkMode: boolean;
    visualizationMode: null | 'bars' | 'wave' | 'random';
}

export interface IndexDispatchToProps {
    doABarrelRoll: () => void;
    flipIt: (value: boolean | null) => void;
    toggleDarkMode: () => void;
    changeVisualizationMode: () => void;
}

const mapStateToProps = (state: State): IndexStateToProps => ({
    flipItValue: state.effects.flipIt,
    darkMode: state.effects.darkMode,
    visualizationMode: state.effects.visualizationMode
});

const mapDispatchToProps = (dispatch: any): IndexDispatchToProps => ({
    doABarrelRoll: () => dispatch(doABarrelRoll()),
    flipIt: (flipItValue: boolean | null) => dispatch(flipIt(flipItValue)),
    toggleDarkMode: () => dispatch(toggleDarkMode()),
    changeVisualizationMode: () => dispatch(changeVisualization()),
});

export const Home = withTranslation('translations')(connect(mapStateToProps, mapDispatchToProps)(HomeComponent));
export const Component = Home;
