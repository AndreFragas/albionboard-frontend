import {yupResolver} from '@hookform/resolvers/yup';
import {Grid} from '@mui/material';
import Box, {BoxProps} from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {useTheme} from '@mui/system';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import {GridDropdown} from 'src/@prismafive/components/form-fields-with-grid/grid-dropdown';
import {GridSwitch} from 'src/@prismafive/components/form-fields-with-grid/grid-switch';
import {GridTextField} from 'src/@prismafive/components/form-fields-with-grid/grid-text-field';
import {ProfileImagePicker} from 'src/@prismafive/components/profile-image-picker';
import {useToast} from 'src/@prismafive/components/toast';
import {onlyDirtFields, swapObjectsToId} from 'src/@prismafive/helper/form-functions';
import {clearAllMasks} from 'src/@prismafive/helper/mask';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {useAcessosModuleApi} from '../../api';
import {UsuarioFormType, useUsuarioFormConfig} from './form-config';
import {UsuarioFormDrawerProps} from './types';

const Header = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

export function UsuarioFormDrawer(props: UsuarioFormDrawerProps) {
  const [foto, setFoto] = useState('');
  const [fotoOriginal, setFotoOriginal] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMaster, setIsMaster] = useState<boolean | undefined>(false);
  const {buildSchema, defaultValues} = useUsuarioFormConfig();
  const {translate} = useTranslate();
  const theme = useTheme();
  const toast = useToast();
  const api = useAcessosModuleApi();

  const {
    control,
    handleSubmit,
    formState: {errors, isDirty, dirtyFields},
    reset,
    setValue,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(buildSchema(isAdmin, props.type)),
    defaultValues,
  });

  useEffect(() => {
    if (props.show) {
      if (props.type === 'create') {
        resetNonFormStates();
        reset(defaultValues);
      } else {
        if (props.usuario) {
          reset(props.usuario as any);
          setIsAdmin(props.usuario.admin);
          setIsMaster(props.usuario.master);
          setFotoOriginal(
            props.usuario.foto ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${props.usuario.foto}` : ''
          );
          setFoto(props.usuario.foto ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${props.usuario.foto}` : '');
        }
      }
    }
  }, [props.show]);

  function resetNonFormStates() {
    setFoto('');
    setFotoOriginal('');
    setIsAdmin(false);
    setIsMaster(false);
  }

  async function submit(data: UsuarioFormType) {
    if (!isDirty && foto === fotoOriginal) return toast.showErrorToast('global.errors.noEdit');
    if (props.type === 'create' && data.senha !== data.cofirmar_senha)
      return toast.showErrorToast('global.errors.mismatchPasswords');
    let newData = onlyDirtFields<UsuarioFormType>(dirtyFields, data, ['admin', 'ativo']);
    if (newData.admin) {
      newData.grupo_usuario_id = null;
      delete newData.grupo_usuario;
    }
    if (newData.cofirmar_senha) delete newData.cofirmar_senha;
    newData = swapObjectsToId(newData, ['grupo_usuario']);

    switch (props.type) {
      case 'create': {
        if (foto) newData.foto = foto.replace(process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE ?? '', '');
        return await api.createUsuarios(newData as any, () => {
          toast.showSuccessToast('global.success.register');
          resetNonFormStates();
          reset();
          props.init();
        });
      }
      case 'edit': {
        if (foto !== fotoOriginal) newData.foto = foto.replace(process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE ?? '', '');
        return await api.editUsuarios(newData as any, () => {
          toast.showSuccessToast('global.success.edit');
          props.onClose();
          props.init();
        });
      }
    }
  }

  return (
    <Drawer
      open={props.show}
      anchor="right"
      variant="temporary"
      onClose={props.onClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant="h5">
          {props.type === 'create'
            ? translate('access.createUserTitle')
            : props.type === 'edit'
            ? translate('access.editUserTitle')
            : translate('access.showUserTitle')}
        </Typography>
        <IconButton
          size="small"
          onClick={props.onClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{p: (theme) => theme.spacing(0, 6, 6)}}>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ProfileImagePicker image={foto} setImage={setFoto} />
        </Box>
        <form onSubmit={handleSubmit(submit)}>
          <Grid container spacing={5} sx={{marginTop: 2}}>
            <GridTextField
              control={control}
              errors={errors}
              formType={props.type}
              fieldName="nome"
              label="global.name"
              sm={12}
            />
            <GridTextField
              control={control}
              errors={errors}
              formType={props.type}
              fieldName="email"
              label="global.email"
              sm={12}
              disabled={props.type !== 'create'}
            />
            {props.type === 'create' && (
              <>
                <GridTextField
                  control={control}
                  errors={errors}
                  formType={props.type}
                  fieldName="senha"
                  label="global.password"
                  sm={12}
                  isPassword
                />
                <GridTextField
                  control={control}
                  errors={errors}
                  formType={props.type}
                  fieldName="cofirmar_senha"
                  label="global.confirmPassword"
                  sm={12}
                  isPassword
                />
              </>
            )}
            <GridTextField
              fieldName="telefone"
              control={control}
              formType={props.type}
              label="global.phone"
              sm={12}
              mask="(99) 9999-99999"
              deMask={clearAllMasks}
            />
            <GridSwitch
              control={control}
              fieldName="admin"
              formType={props.type}
              label="global.admin"
              sm={6}
              additionalOnChange={(value: boolean) => {
                setIsAdmin(value);
                if (value) setValue('grupo_usuario', null);
              }}
              disabled={isMaster || props.type === 'details'}
            />
            <GridSwitch
              control={control}
              fieldName="ativo"
              formType={props.type}
              label="global.active"
              sm={6}
              disabled={isMaster || props.type === 'details'}
            />
            {!isAdmin && !isMaster && (
              <GridDropdown
                control={control}
                errors={errors}
                fieldName="grupo_usuario"
                formType={props.type}
                filterBy="nome"
                label="global.userGroup"
                options={props.gruposUsuarios}
                sm={12}
              />
            )}
          </Grid>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5}}>
            {props.type !== 'details' && (
              <Button type="submit" variant="contained" sx={{mr: 3}}>
                {translate('global.save')}
              </Button>
            )}
            <Button variant="tonal" color="secondary" onClick={props.onClose}>
              {translate('global.cancel')}
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
}
