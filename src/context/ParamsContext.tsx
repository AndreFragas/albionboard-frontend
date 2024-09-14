import {PropsWithChildren, createContext, useContext, useEffect, useState} from 'react';
import {useApi} from 'src/@prismafive/hooks/use-api';
import {useAuth} from 'src/@prismafive/hooks/use-auth';

interface IParametrosContext {
  parametros: Record<string, any>;
  updateParametros: () => Promise<void>;
}

const ParametrosContext = createContext<IParametrosContext>({
  parametros: {},
  updateParametros: async () => Promise.resolve(),
});

export function ParametrosProvider(props: PropsWithChildren) {
  const [parametrosContext, setParametrosContext] = useState<Record<string, any>>({});
  // const getParametrosService = useApi<Record<string, any>>('GET', '/api/parametros/fetch', {
  //   params: {entidades: '*'},
  // });
  const auth = useAuth();
  const url = window.location.href;

  async function fetch() {
    if (url && url.includes('intranet')) return;
    // const response = await getParametrosService.fetch();
    // if (response) setParametrosContext(response);
  }

  useEffect(() => {
    const handleStorageChange = () => {
      fetch();
    };

    window.addEventListener('filial_changed', handleStorageChange);

    return () => {
      window.removeEventListener('filial_changed', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (auth.user) {
      fetch();
    }
  }, [auth.user]);

  async function updateParametros() {
    fetch();
  }

  return (
    <ParametrosContext.Provider value={{parametros: parametrosContext, updateParametros}}>
      {props.children}
    </ParametrosContext.Provider>
  );
}

export function useParametros() {
  const {parametros, updateParametros} = useContext(ParametrosContext);

  function getParametro<T = any>(chave: string): T {
    return parametros[chave];
  }

  return {parametros, getParametro, updateParametros};
}
