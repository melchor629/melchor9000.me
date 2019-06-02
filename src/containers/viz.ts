import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { State } from '../redux/reducers';
import VizComponent from '../components/viz';

export interface VizStateToProps {
    darkMode: boolean;
}

const mapStateToProps = (state: State): VizStateToProps => ({
    darkMode: state.effects.darkMode
});

export const Viz = withTranslation()(connect(mapStateToProps)(VizComponent));
export const Component = Viz;
