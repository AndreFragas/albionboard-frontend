import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {isEmpty} from 'lodash';
import {useEffect, useState} from 'react';
import PageHeader from 'src/@core/components/page-header';
import {useReload} from 'src/@prismafive/hooks/use-reload';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {useAcessosModuleApi} from './api';
import {RolesCards} from './components/role-cards';
import {SessionTable} from './components/session-table';
import {UserTable} from './components/user-table';
import {IGrupoUsuario, IPermissao, ISession, IUsuario} from './types';

export function AcessosScreen() {
  const [permissoes, setPermissoes] = useState<string[]>([]);
  const [permissoesFilial, setPermissoesFilial] = useState<string[]>([]);
  const [permissoesObject, setPermissoesObject] = useState<IPermissao[]>([]);
  const [gruposUsuarios, setGruposUsuarios] = useState<IGrupoUsuario[]>([]);
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const {translate} = useTranslate();
  const {triggerReload} = useReload();
  const api = useAcessosModuleApi();

  async function init() {
    const [permissoesResponse, gruposUsuariosResponse, usuariosResponse, sessionsResponse] = await Promise.all([
      api.listPermissoes(),
      api.listGruposUsuario(),
      api.listUsuarios(),
      api.listSessions(),
    ]);
    if (!isEmpty(permissoesResponse)) {
      const filtered = permissoesResponse.filter((permissao: IPermissao) => permissao.final_rota);
      let filteredPermissoes: string[] = [];
      let filteredPermissoesFilial: string[] = [];
      filtered.forEach((permissao) => {
        if (permissao.admin) return;
        if (permissao.filial) return filteredPermissoesFilial.push(permissao.nome);
        filteredPermissoes.push(permissao.nome);
      });

      setPermissoesFilial(filteredPermissoesFilial);
      setPermissoes(filteredPermissoes);
      setPermissoesObject(permissoesResponse);
    }
    if (!isEmpty(gruposUsuariosResponse)) setGruposUsuarios(gruposUsuariosResponse);
    if (!isEmpty(usuariosResponse)) setUsuarios(usuariosResponse);
    if (!isEmpty(sessionsResponse)) setSessions(sessionsResponse);
    triggerReload();
  }

  useEffect(() => {
    init();
  }, []);

  function deleteGroup(id: number) {
    const newGroups = [...gruposUsuarios];
    setGruposUsuarios(newGroups.filter((group) => group.id !== id));
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant="h4" sx={{mb: 6}}>
            {translate('global.accesses')}
          </Typography>
        }
      />
      <Grid item xs={12}>
        <RolesCards
          permissoes={permissoes}
          permissoesFilial={permissoesFilial}
          gruposUsuarios={gruposUsuarios}
          deleteGroup={deleteGroup}
          permissoesObject={permissoesObject}
          init={init}
        />
      </Grid>
      <Grid item xs={12}>
        <UserTable usuarios={usuarios} init={init} gruposUsuarios={gruposUsuarios} />
      </Grid>

      <Grid item xs={12}>
        <SessionTable sessions={sessions} init={init} />
      </Grid>
    </Grid>
  );
}
