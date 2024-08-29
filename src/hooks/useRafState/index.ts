import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import useUnmount from '../useUnmount';

type InitialState<S> = S | (() => S) | undefined;
type SetRafState<S> = S | ((prevState: S) => S)

function useRafState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
function useRafState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

function useRafState<S>(initialState?: InitialState<S>) {
  const ref = useRef(0);
  const [state, setState] = useState<InitialState<S> | SetRafState<S>>(initialState);

  const setRafState = useCallback((value: SetRafState<S>) => {
    cancelAnimationFrame(ref.current);

    ref.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  useUnmount(() => {
    cancelAnimationFrame(ref.current);
  });

  return [state, setRafState] as const;
}

export default useRafState;
