import {useApi} from 'src/@prismafive/hooks/use-api';
import {CreateEditGrupoUsuarioDto, IGrupoUsuario, IPermissao, IUsuario} from './types';

export function useAcessosModuleApi() {
  const listPermissoesService = useApi<IPermissao[]>('GET', '/api/permissoes');
  const listGruposUsuarioService = useApi<IGrupoUsuario[]>('GET', '/api/grupo-usuarios');
  const deleteGrupoUsuariosService = useApi('DELETE', '');
  const createGrupoUsuariosService = useApi('POST', '/api/grupo-usuarios');
  const editGrupoUsuariosService = useApi('PUT', '');
  const listUsuariosService = useApi<IUsuario[]>('GET', '/api/usuarios');
  const createUsuariosService = useApi('POST', '/api/usuarios');
  const editUsuariosService = useApi('PUT', '');
  const deleteUsuariosService = useApi('DELETE', '');
  const listSessionsService = useApi('GET', '/api/sessoes');
  const deleteSessionService = useApi('DELETE', '');

  async function deleteGrupoUsuarios(id: string | number, onSuccess?: () => void) {
    return await deleteGrupoUsuariosService.fetch({
      dynamicRoute: `/api/grupo-usuarios/${id}`,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function createGrupoUsuarios(data: CreateEditGrupoUsuarioDto, onSuccess?: () => void) {
    return await createGrupoUsuariosService.fetch({dynamicParams: data, dynamicOnSuccess: onSuccess});
  }

  async function editGrupoUsuarios(id: number, data: CreateEditGrupoUsuarioDto, onSuccess?: () => void) {
    return await editGrupoUsuariosService.fetch({
      dynamicRoute: `/api/grupo-usuarios/${id}`,
      dynamicParams: data,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function deleteUsuarios(id: string | number, onSuccess?: () => void) {
    return await deleteUsuariosService.fetch({
      dynamicRoute: `/api/usuarios/${id}`,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function createUsuarios(data: Partial<IUsuario>, onSuccess?: () => void) {
    return await createUsuariosService.fetch({
      dynamicParams: data,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function editUsuarios(data: Partial<IUsuario>, onSuccess?: () => void) {
    return await editUsuariosService.fetch({
      dynamicRoute: `/api/usuarios/${data.id}`,
      dynamicParams: data,
      dynamicOnSuccess: onSuccess,
    });
  }

  async function deleteSession(id: string, onSuccess?: () => void) {
    return await deleteSessionService.fetch({
      dynamicRoute: `/api/session/${id}`,
      dynamicOnSuccess: onSuccess,
    });
  }

  return {
    listPermissoes: async () => await listPermissoesService.fetch(),
    listGruposUsuario: async () => await listGruposUsuarioService.fetch(),
    deleteGrupoUsuarios,
    createGrupoUsuarios,
    editGrupoUsuarios,
    listUsuarios: async () => await listUsuariosService.fetch(),
    deleteUsuarios,
    createUsuarios,
    editUsuarios,
    listSessions: async () => await listSessionsService.fetch(),
    deleteSession,
  };
}
