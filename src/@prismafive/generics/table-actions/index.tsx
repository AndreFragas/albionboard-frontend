import {Can, useAbility} from '@casl/react';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {GridActionsCellItem, GridRowId, GridRowParams} from '@mui/x-data-grid-pro';
import {useConfirmModal} from 'src/@prismafive/components/modals/confirm-modal';
import {useToast} from 'src/@prismafive/components/toast';
import {useNavigate} from 'src/@prismafive/hooks/use-navigate';
import {useReload} from 'src/@prismafive/hooks/use-reload';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {AbilityContext} from 'src/layouts/components/acl/Can';
import {GenericTableActionsProps} from './types';

export function useGenericTableActions(props: GenericTableActionsProps) {
  const abilities = useAbility(AbilityContext);
  const {navigate} = useNavigate();
  const {translate} = useTranslate();
  const confirmModal = useConfirmModal();
  const {triggerReload} = useReload();
  const toast = useToast();

  async function deleteOnClick(id: GridRowId) {
    await props.api.deleteItem(id as number, () => {
      triggerReload();
      toast.showSuccessToast('global.success.delete');
    });
  }

  function validateExtraActions(id: number) {
    if (props.extraActions) {
      return props.extraActions.map((func: any) => func(id));
    }
    return [];
  }

  function readComponent(params: GridRowParams) {
    return (
      <>
        {!props.excludeActions?.includes('read') && (
          <Can I={'read'} a={props.permission} ability={abilities}>
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              onClick={() => navigate(`${props.route}/details`, {id: params.id})}
              title={translate('global.show')}
            />
          </Can>
        )}
      </>
    );
  }

  function editComponent(params: GridRowParams) {
    return (
      <>
        {!props.excludeActions?.includes('edit') && (
          <Can I={'edit'} a={props.permission} ability={abilities}>
            <GridActionsCellItem
              icon={<ModeEditIcon />}
              onClick={() => navigate(`${props.route}/edit`, {id: params.id})}
              title={translate('global.edit')}
            />
          </Can>
        )}
      </>
    );
  }

  function deleteComponent(params: GridRowParams) {
    return (
      <>
        {!props.excludeActions?.includes('delete') && (
          <Can I={'delete'} a={props.permission} ability={abilities}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              onClick={() => {
                confirmModal.show({
                  message: translate('global.confirmations.delete'),
                  onConfirm: () => deleteOnClick(params.id),
                });
              }}
              title={translate('global.delete')}
            />
          </Can>
        )}
      </>
    );
  }

  const actions = {
    field: 'actions',
    headerName: translate('global.actions'),
    flex: 0.2,
    type: 'actions',
    getActions: (params: GridRowParams) => [
      ...validateExtraActions(params.id as number),
      readComponent(params),
      editComponent(params),
      deleteComponent(params),
    ],
  };

  return {
    actions,
    readComponent,
    editComponent,
    deleteComponent,
  };
}
