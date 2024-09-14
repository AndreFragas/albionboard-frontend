export const searchIncludeCreateBlackList = [
  'Financeiro.Cadastros.PlanoDeContas',
  'Financeiro.Relatorios',
  'Financeiro.ConciliacaoBancaria',
  'Configuracoes.Acessos',
  'Configuracoes.Email',
  'Configuracoes.Empresa',
  'GestaoCompras.ConsultaPedidos',
];

export const noEditPermissionBlackList = ['Financeiro.Relatorios'];

export const noDeletePermissionBlackList = [
  'Financeiro.Relatorios',
  'Configuracoes.Email',
  'GestaoCompras.ConsultaPedidos',
];

export const noCreatePermissionBlackList = [
  'Financeiro.Relatorios',
  'Configuracoes.Email',
  'GestaoCompras.ConsultaPedidos',
];

export const blockChangeFilialRoutes: Record<string, string> = {
  ['/estoque/nota-fiscal-entrada/create/']: 'global.warnings.blockedFilial.notaFiscalCreate',
};
