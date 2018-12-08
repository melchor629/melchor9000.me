import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { State } from '../redux/reducers';
import { changeTitle } from '../redux/title/actions';
import VizComponent from '../components/viz';

export interface VizStateToProps {
    darkMode: boolean;
}

export interface VizDispatchToProps {
    changeTitle: (title: string) => void;
}

const mapStateToProps = (state: State): VizStateToProps => ({
    darkMode: state.effects.darkMode
});

const mapDispatchToProps = (dispatch: any): VizDispatchToProps => ({
    changeTitle: (title: String) => dispatch(changeTitle(title)),
});

export const Viz = withNamespaces()(connect(mapStateToProps, mapDispatchToProps)(VizComponent));
export const Component = Viz;
