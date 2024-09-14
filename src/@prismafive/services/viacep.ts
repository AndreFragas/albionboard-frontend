import {IViaCep} from 'src/@types/global-types';
import {useApi} from '../hooks/use-api';

export function useViaCepService() {
  const viaCepService = useApi<IViaCep>('GET', '', {
    client: 'viaCep',
    setLoading: false,
  });

  async function fetch(cep: string) {
    return viaCepService.fetch({
      dynamicRoute: `${cep}/json/`,
    });
  }

  return {fetch};
}
