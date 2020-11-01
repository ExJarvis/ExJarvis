import * as React from 'react';
const { useReducer } = React;

type Action<T> = (state: T, newState: Partial<T>) => T;

type CB<T> = (updatedState: T) => void;
type SetState<T> = (newState: Partial<T>, cb?: CB<T>) => void;

function useGenState<T>(
  initialState: T
): [T, SetState<T>] {
  type U = T & { cb?: CB<T> };
  const [state, setState] = useReducer<Action<U>>(genericSetState, {
    ...initialState,
    cb: () => {},
  } as unknown as U);

  React.useEffect(() => {
    if(state.cb) {
      state.cb(state);
    }
  }, [state.cb]);

  const setStateLocal: SetState<T> = (newState, cb) => {
    setState({
      ...newState,
      cb,
    } as unknown as U);
  };

  return [state as T, setStateLocal];
}

function genericSetState<T>(state: T, newState: Partial<T>): T {
  return {
    ...state,
    ...newState,
  };
}

export { useGenState };
