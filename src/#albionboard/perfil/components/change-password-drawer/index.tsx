import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Grid} from '@mui/material';
import {useForm} from 'react-hook-form';
import {RightDrawer} from 'src/@prismafive/components/drawer';
import {GridTextField} from 'src/@prismafive/components/form-fields-with-grid/grid-text-field';
import {useToast} from 'src/@prismafive/components/toast';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {usePerfilModuleApi} from '../../api';
import {ChangePasswordFormType, useChangePasswordFormConfig} from './form-config';
import {ChangePasswordDrawerProps} from './types';

export function ChangePasswordDrawer(props: ChangePasswordDrawerProps) {
  const {translate} = useTranslate();
  const {schema, defaultValues} = useChangePasswordFormConfig();
  const api = usePerfilModuleApi();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
    defaultValues,
  });

  async function onSubmit(data: ChangePasswordFormType) {
    if (!props.userId) return;
    if (data.newPassword !== data.confirmNewPassword) return toast.showErrorToast('profile.differentPasswords');

    return await api.trocarSenha(
      {id: props.userId, senha: data.currentPassword!, nova_senha: data.newPassword!},
      () => {
        toast.showSuccessToast('global.success.edit');
        reset();
        props.onClose();
      }
    );
  }

  return (
    <RightDrawer
      onClose={() => {
        reset();
        props.onClose();
      }}
      show={props.show}
      title="global.changePassword"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <GridTextField
            fieldName="currentPassword"
            label="profile.currentPassword"
            control={control}
            errors={errors}
            maxLength={50}
            sm={12}
            autoFocus
            isPassword
          />
          <GridTextField
            fieldName="newPassword"
            label="profile.newPassword"
            control={control}
            errors={errors}
            maxLength={50}
            sm={12}
            isPassword
          />
          <GridTextField
            fieldName="confirmNewPassword"
            label="profile.newPasswordConfirm"
            control={control}
            errors={errors}
            maxLength={50}
            sm={12}
            isPassword
          />
        </Grid>

        <Button type="submit" variant="contained" sx={{marginTop: 5}}>
          {translate('global.save')}
        </Button>
      </form>
    </RightDrawer>
  );
}
