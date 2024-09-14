import {PropsWithChildren, ReactElement, createContext} from 'react';
import {useStateWithHistory} from './use-state-with-history';

const initialContextValues = {};

const ContextComponent = createContext({
  context: initialContextValues,
});

let setContextInstance: (key: string, value: any) => void;
let contextValues: Record<string, any>;
let getValue: (key: string) => any;
let clearContext: () => void;
let setMultipleContextInstance: (data: Record<string, any>) => void;

function GlobalContext(props: PropsWithChildren): ReactElement {
  const [localContext, setLocalContextValue] = useStateWithHistory({
    values: initialContextValues,
  });

  contextValues = localContext.values;
  getValue = function getValueFunction(key: string) {
    return localContext.values[key];
  };

  setContextInstance = function setContext(key: string, newValue: any) {
    const newState = {
      ...localContext.values,
      [key]: newValue,
    };
    setLocalContextValue({values: newState});
  };

  setMultipleContextInstance = function setContext(data: Record<string, any>) {
    const newState = {
      ...localContext.values,
      ...data,
    };
    setLocalContextValue({values: newState});
  };

  clearContext = function clearLocalContext() {
    setLocalContextValue({values: initialContextValues});
  };

  return <ContextComponent.Provider value={{context: localContext.values}}>{props.children}</ContextComponent.Provider>;
}

export function useGlobalContext() {
  return {
    Component: GlobalContext,
    setContext: setContextInstance,
    getValue,
    clearContext,
    values: contextValues,
    setMultipleContext: setMultipleContextInstance,
  };
}
