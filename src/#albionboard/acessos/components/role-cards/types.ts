import {IGrupoUsuario, IPermissao} from '../../types';

export interface RolesCardsProps {
  permissoes: string[];
  permissoesFilial: string[];
  gruposUsuarios: IGrupoUsuario[];
  permissoesObject: IPermissao[];
  deleteGroup: (id: number) => void;
  init: () => void;
}
