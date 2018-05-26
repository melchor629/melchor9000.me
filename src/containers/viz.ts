import { connect } from 'react-redux';
import { State } from 'src/redux/reducers';
import { changeTitle } from 'src/redux/title/actions';
import VizComponent from 'src/components/viz';

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

export const Viz = connect(mapStateToProps, mapDispatchToProps)(VizComponent);
export const Component = Viz;
