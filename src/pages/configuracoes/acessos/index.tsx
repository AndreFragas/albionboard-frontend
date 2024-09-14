import {AcessosScreen} from 'src/#albionboard/acessos/screen';

const AcessosScreenConfig = () => {
  return <AcessosScreen />;
};

AcessosScreenConfig.acl = {
  action: 'read',
  subject: 'Configuracoes.Acessos',
};

export default AcessosScreenConfig;
