import {ModuloScreen} from 'src/#albionboard/modulos';

const Configuracoes = () => {
  return <ModuloScreen />;
};

Configuracoes.acl = {
  subject: 'Configuracoes',
  action: 'read',
};

export default Configuracoes;
