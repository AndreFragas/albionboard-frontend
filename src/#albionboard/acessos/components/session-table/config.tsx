import {Can, useAbility} from '@casl/react';
import DeleteIcon from '@mui/icons-material/Delete';
import {Box, Typography} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {GridActionsCellItem, GridRowParams} from '@mui/x-data-grid-pro';
import moment from 'moment';
import {useConfirmModal} from 'src/@prismafive/components/modals/confirm-modal';
import {useToast} from 'src/@prismafive/components/toast';
import {maskTelefone} from 'src/@prismafive/helper/mask';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {AbilityContext} from 'src/layouts/components/acl/Can';
import {useAcessosModuleApi} from '../../api';
import {ISession} from '../../types';

export function useAcessosSessionsTableConfig(props: {init: () => void}) {
  const {translate} = useTranslate();
  const currentUser = getLocalStorage(window, 'userData');
  const abilities = useAbility(AbilityContext);
  const confirmModal = useConfirmModal();
  const toast = useToast();
  const api = useAcessosModuleApi();

  async function deleteOnClick(id: string) {
    await api.deleteSession(id, () => {
      props.init();
      toast.showSuccessToast('acessos.success.endSession');
    });
  }

  function generateConfig() {
    return [
      {
        field: 'nome',
        headerName: translate('global.user'),
        flex: 0.4,
        renderCell: (params: GridRowParams<ISession>) => {
          return (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Avatar
                alt={params.row.usuario.nome}
                src={
                  params.row.usuario.foto
                    ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${params.row.usuario.foto}`
                    : ''
                }
              />
              <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', marginLeft: 2}}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': {color: 'primary.main'},
                    cursor: 'pointer',
                  }}
                >
                  {params.row.usuario.nome}
                </Typography>
                <Typography noWrap variant="body2" sx={{color: 'text.disabled'}}>
                  {params.row.usuario.email}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'start',
        headerName: translate('global.start'),
        flex: 0.2,
        valueGetter: (params: GridRowParams<ISession>) =>
          moment(params.row.data_criacao).format('DD/MM/YYYY - HH:mm:ss'),
      },
      {
        field: 'telefone',
        headerName: translate('global.phone'),
        flex: 0.2,
        valueGetter: (params: GridRowParams<ISession>) => maskTelefone(params.row.usuario.telefone),
      },
      {
        field: 'actions',
        headerName: translate('global.actions'),
        flex: 0.2,
        type: 'actions',
        getActions: (params: GridRowParams<ISession>) => [
          <Can I={'delete'} a={'Configuracoes.Acessos'} ability={abilities}>
            {currentUser.id !== params.row.usuario_id && (
              <GridActionsCellItem
                title={translate('acessos.endSession')}
                label={translate('acessos.endSession')}
                icon={<DeleteIcon />}
                onClick={() => {
                  confirmModal.show({
                    message: translate('acessos.warning.endSession'),
                    onConfirm: () => deleteOnClick(params.row.usuario_id),
                  });
                }}
              />
            )}
          </Can>,
        ],
      },
    ];
  }

  return {
    generateConfig,
  };
}
