import {useState} from 'react';

let triggerReload = () => {};
let reload: boolean;

export function useReload() {
  function ReloadComponent() {
    const [internalReload, setInternalReload] = useState(false);

    triggerReload = () => setInternalReload(!internalReload);
    reload = internalReload;
    return <></>;
  }

  return {
    Component: ReloadComponent,
    reload,
    triggerReload,
  };
}
