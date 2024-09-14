import {IGrupoUsuario, IUsuario} from '../../types';

export interface UserTableProps {
  usuarios: IUsuario[];
  gruposUsuarios: IGrupoUsuario[];
  init: () => void;
}

export interface UsuarioFormDrawerProps {
  type: string;
  usuario?: IUsuario;
  gruposUsuarios: IGrupoUsuario[];
  show: boolean;
  onClose: () => void;
  init: () => void;
}
