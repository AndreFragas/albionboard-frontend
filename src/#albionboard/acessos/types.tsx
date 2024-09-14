export interface IPermissao {
  id: string;
  nome: string;
  final_rota: boolean;
  data_criacao: string;
  data_atualizacao: string;
  ativa: boolean;
  filial?: boolean;
  admin?: boolean;
}

export interface IGrupoUsuario {
  id: number;
  nome: string;
  grupo_usuario_permissoes: IPermissaoGrupo[];
  usuarios: IUsuario[];
}

export interface IUsuario {
  id: number;
  nome: string;
  grupo_usuario_id: number;
  email: string;
  admin: boolean;
  foto?: string;
  grupo_usuario?: Partial<IUsuario>;
  master?: boolean;
  ativo?: boolean;
  telefone?: string;
}

export interface IPermissaoGrupo {
  id: number;
  grupo_usuario_id: number;
  permissao_id: string;
  permissao?: IPermissao;
  read: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  filial_id?: number;
}

export interface CreateEditGrupoUsuarioDto {
  id?: number;
  nome: string;
  grupo_usuario_permissoes: Partial<IPermissaoGrupo>[];
}

export interface IPermissaoLogin {
  id: string;
  subject: string;
  final_rota: boolean;
  actions: string[];
  filial: boolean;
  admin: boolean;
  filial_id?: number;
}

export interface ISession {
  id: number;
  token: string;
  usuario_id: string;
  data_criacao: string;
  data_atualizacao: string;
  usuario: IUsuario;
}
