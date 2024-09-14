import {useApi} from 'src/@prismafive/hooks/use-api';
import {IUsuario} from '../acessos/types';

export function usePerfilModuleApi() {
  const getByIdUserService = useApi<IUsuario>('GET', '');
  const trocarSenhaService = useApi<IUsuario>('POST', '/api/usuarios/trocar-senha');

  async function getByIdUser(id: string, onSuccess?: () => void) {
    return await getByIdUserService.fetch({
      dynamicRoute: `/api/usuarios/${id}`,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function trocarSenha(
    data: {
      id: string;
      senha: string;
      nova_senha: string;
    },
    onSuccess?: () => void
  ) {
    return await trocarSenhaService.fetch({
      dynamicParams: data,
      dynamicOnSuccess: onSuccess,
    });
  }

  return {
    getByIdUser,
    trocarSenha,
  };
}
