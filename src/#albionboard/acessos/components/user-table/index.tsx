import {useAbility} from '@casl/react';
import {useState} from 'react';
import {FormCard} from 'src/@prismafive/components/cards/form-card';
import {DefaultTable} from 'src/@prismafive/components/tables/default-table';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {AbilityContext} from 'src/layouts/components/acl/Can';
import {IUsuario} from '../../types';
import {useAcessosUsuarioTableConfig} from './config';
import {UsuarioFormDrawer} from './form-screen';
import {UserTableProps} from './types';

export function UserTable(props: UserTableProps) {
  const [openIncludeDialog, setOpenIncludeDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUsuario>();
  const [type, setType] = useState('');
  const loggerUserId = getLocalStorage(window, 'userData')?.id;
  const config = useAcessosUsuarioTableConfig({init: props.init});
  const abilities = useAbility(AbilityContext);

  function openIncludeUsuario() {
    setType('create');
    setOpenIncludeDialog(true);
    setSelectedUser(undefined);
  }

  function openShowUser(user: IUsuario) {
    setType('details');
    setOpenIncludeDialog(true);
    setSelectedUser(user);
  }

  function openEditUser(user: IUsuario) {
    setType('edit');
    setOpenIncludeDialog(true);
    setSelectedUser(user);
  }

  function onClose() {
    setType('');
    setOpenIncludeDialog(false);
    setSelectedUser(undefined);
  }

  return (
    <FormCard
      title="global.users"
      hideReturnButton
      includeButton={abilities.can('create', 'Configuracoes.Acessos')}
      onIncludeButtonClick={openIncludeUsuario}
    >
      <DefaultTable
        columnDefinition={config.generateConfig(openShowUser, openEditUser, loggerUserId)}
        data={props.usuarios}
        tableName="acessos_users"
      />
      <UsuarioFormDrawer
        type={type}
        usuario={selectedUser}
        show={openIncludeDialog}
        onClose={onClose}
        gruposUsuarios={props.gruposUsuarios}
        init={props.init}
      />
    </FormCard>
  );
}
