import {Can, useAbility} from '@casl/react';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Box, Typography} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import {GridActionsCellItem, GridRowParams} from '@mui/x-data-grid-pro';
import CustomChip from 'src/@core/components/mui/chip';
import {CheckBox} from 'src/@prismafive/components/form-fields/check-box';
import {useConfirmModal} from 'src/@prismafive/components/modals/confirm-modal';
import {useToast} from 'src/@prismafive/components/toast';
import {maskTelefone} from 'src/@prismafive/helper/mask';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {AbilityContext} from 'src/layouts/components/acl/Can';
import {useAcessosModuleApi} from '../../api';
import {IUsuario} from '../../types';

export function useAcessosUsuarioTableConfig(props: {init: () => void}) {
  const {translate} = useTranslate();
  const abilities = useAbility(AbilityContext);
  const confirmModal = useConfirmModal();
  const toast = useToast();
  const api = useAcessosModuleApi();

  async function deleteOnClick(id: number | string) {
    await api.deleteUsuarios(id, () => {
      props.init();
      toast.showSuccessToast('global.success.delete');
    });
  }

  function generateConfig(
    openShowUser: (user: IUsuario) => void,
    openEditUser: (user: IUsuario) => void,
    loggerUserId: number
  ) {
    return [
      {
        field: 'nome',
        headerName: `${translate('global.user')}`,
        flex: 0.2,
        renderCell: (params: GridRowParams<IUsuario>) => {
          return (
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Avatar
                alt={params.row.nome}
                src={params.row.foto ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${params.row.foto}` : ''}
              />
              <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', marginLeft: 2}}>
                <Typography
                  noWrap
                  onClick={() => openShowUser(params.row)}
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': {color: 'primary.main'},
                    cursor: 'pointer',
                  }}
                >
                  {params.row.nome}
                </Typography>
                <Typography noWrap variant="body2" sx={{color: 'text.disabled'}}>
                  {params.row.email}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        field: 'grupo_usuario',
        headerName: `${translate('global.userGroup')}`,
        flex: 0.3,
        valueGetter: (params: GridRowParams<IUsuario>) => params.row.grupo_usuario?.nome,
      },
      {
        field: 'telefone',
        headerName: `${translate('global.phone')}`,
        flex: 0.1,
        valueGetter: (params: GridRowParams<IUsuario>) => maskTelefone(params.row.telefone),
      },
      {
        field: 'admin',
        headerName: translate('global.admin'),
        flex: 0.1,
        renderCell: (params: GridRowParams<IUsuario>) => (
          <CheckBox label="" disabled onChange={() => {}} value={params.row.admin} />
        ),
      },
      {
        field: 'ativo',
        headerName: translate('global.status'),
        flex: 0.1,
        renderCell: (params: GridRowParams<IUsuario>) => (
          <CustomChip
            rounded
            size="small"
            skin="light"
            color={params.row.ativo ? 'success' : 'error'}
            label={params.row.ativo ? translate('global.active') : translate('global.inactive')}
            sx={{'& .MuiChip-label': {textTransform: 'capitalize'}}}
          />
        ),
      },
      {
        field: 'actions',
        headerName: `${translate('global.actions')}`,
        flex: 0.2,
        type: 'actions',
        getActions: (params: GridRowParams<IUsuario>) => [
          <Can I={'read'} a={'Configuracoes.Acessos'} ability={abilities}>
            <GridActionsCellItem
              label="Visualizar"
              icon={<VisibilityIcon />}
              onClick={() => openShowUser(params.row)}
              title={`${translate('global.show')}`}
            />
          </Can>,
          <Can I={'edit'} a={'Configuracoes.Acessos'} ability={abilities}>
            <GridActionsCellItem
              label="Editar"
              icon={<ModeEditIcon />}
              onClick={() => openEditUser(params.row)}
              title={`${translate('global.edit')}`}
            />
          </Can>,
          <>
            {!params.row.master && params.row.id !== loggerUserId && (
              <Can I={'delete'} a={'Configuracoes.Acessos'} ability={abilities}>
                <GridActionsCellItem
                  label="Excluir"
                  icon={<DeleteIcon />}
                  onClick={() => {
                    confirmModal.show({
                      message: translate('global.confirmations.delete'),
                      onConfirm: () => deleteOnClick(params.id),
                    });
                  }}
                  title={`${translate('global.delete')}`}
                />
              </Can>
            )}
          </>,
        ],
      },
    ];
  }

  return {
    generateConfig,
  };
}
