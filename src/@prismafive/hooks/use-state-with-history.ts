//@ts-nocheck
import {type} from 'ramda';
import React from 'react';

type TState = [state: any, setState: (...props: any[]) => void];

export function useStateWithHistory<State>(initialState?: any): TState {
  const [state, setUseState] = React.useState<State>(initialState);

  const setState = (newState: any) => {
    if (type(newState) === 'Array') return setUseState((prev: any[]) => [...prev, ...newState]);

    if (type(newState) === 'Object')
      return setUseState((prev: {[key: string]: any}) => ({
        ...prev,
        ...newState,
      }));

    return setUseState(newState);
  };

  return [state, setState];
}
