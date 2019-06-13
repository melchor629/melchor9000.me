import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

//TEMP-FIX: right now there's no typings for these new hooks from react-redux, so I'm writing these manually
declare module 'react-redux' {
    export function useSelector<T, U>(selector: (state: T) => U, equalityFunction?: (a: U, b: U) => boolean): U;
    export function useDispatch<S, E, A extends Action<any>>(): Dispatch<A> & ThunkDispatch<S, E, A>;
}