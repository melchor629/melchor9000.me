import { State } from '../redux/reducers';
import { changeVisualization, doABarrelRoll, flipIt, toggleDarkMode } from '../redux/effects/actions';
import { changeTitle } from '../redux/title/actions';
import { connect } from 'react-redux';
import HomeComponent from '../components/home/home';

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
    changeTitle: (title: string) => void;
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
    changeTitle: (title: String) => dispatch(changeTitle(title)),
});

export const Home = connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
export const Component = Home;
