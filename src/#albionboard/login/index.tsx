import ffwebBanner from '#assets/png/Albion_Online_Logo.png';
import loginBackgroundLogo from '#assets/png/login-background.png';
import loginLogo from '#assets/png/boi-albion.png';
import {yupResolver} from '@hookform/resolvers/yup';
import Box, {BoxProps} from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import MuiFormControlLabel, {FormControlLabelProps} from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import {styled, useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import CustomTextField from 'src/@core/components/mui/text-field';
import {GridTextField} from 'src/@prismafive/components/form-fields-with-grid/grid-text-field';
import {useConfirmModal} from 'src/@prismafive/components/modals/confirm-modal';
import {DefaultModalGeneric} from 'src/@prismafive/components/modals/default-modal-generic';
import {useToast} from 'src/@prismafive/components/toast';
import {flexGenerator} from 'src/@prismafive/helper/flex-generator';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {useLoginModuleApi} from './api';
import {useLoginFormConfig} from './form-config';
import {LoginFormData} from './types';

const RightWrapper = styled(Box)<BoxProps>(({theme}) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750,
  },
}));

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({theme}) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary,
  },
}));

export function LoginComponent() {
  const [showModal, setShowModal] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {translate} = useTranslate();
  const {getLoginDefaultValues, loginSchema, resetPasswordDefaultValues, resetPasswordSchema} = useLoginFormConfig();
  const toast = useToast();
  const auth = useAuth();
  const theme = useTheme();
  const hidden = useMediaQuery(theme.breakpoints.down('md'));
  const confirmModal = useConfirmModal();
  const api = useLoginModuleApi();

  const loginForm = useForm({
    defaultValues: getLoginDefaultValues(window),
    mode: 'onBlur',
    resolver: yupResolver(loginSchema),
  });

  const resetPasswordForm = useForm({
    defaultValues: resetPasswordDefaultValues,
    mode: 'onBlur',
    resolver: yupResolver(resetPasswordSchema),
  });

  function onSubmit(data: LoginFormData) {
    auth.login({email: data.email, senha: data.senha, rememberMe}, (error: any) => {
      let errorMessages = '';
      error.response?.data.errors.forEach((element: any) => {
        errorMessages += `${translate(element.message)}\n`;
      });
      confirmModal.show({
        message: errorMessages,
        hideCancel: true,
      });
    });
  }

  function resetPassword(data: {email: string}) {
    confirmModal.show({
      message: 'login.warnings.resetPassword',
      onConfirm: () => {
        api.resetPassword(data.email, () => {
          setShowModal(false);
          toast.showSuccessToast('login.success.resetPassword');
        });
      },
    });
  }

  return (
    <Box
      className="content-right"
      sx={{
        backgroundImage: !hidden ? `url(${loginBackgroundLogo.src})` : '',
        backgroundRepeat: 'no-repeat',
        backgroundPositionY: 'bottom',
      }}
    >
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            margin: (theme) => theme.spacing(8, 0, 8, 8),
          }}
        >
          <Image src={loginLogo} alt="" style={{marginBottom: 15}} />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{width: '100%', maxWidth: 400}}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Image src={ffwebBanner} alt="" width={600} height={200} style={{marginBottom: 15}} />
              {/* <LanguageDropdown isLogin /> */}
            </Box>

            <form noValidate autoComplete="off" onSubmit={loginForm.handleSubmit(onSubmit)}>
              <Box sx={{mb: 4}}>
                <Controller
                  name="email"
                  control={loginForm.control}
                  rules={{required: true}}
                  render={({field: {value, onChange, onBlur}}) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={translate('login.email')}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(loginForm.formState.errors.email)}
                      {...(loginForm.formState.errors.email && {helperText: loginForm.formState.errors.email.message})}
                    />
                  )}
                />
              </Box>
              <Box sx={{mb: 1.5}}>
                <Controller
                  name="senha"
                  control={loginForm.control}
                  rules={{required: true}}
                  render={({field: {value, onChange, onBlur}}) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label={translate('login.password')}
                      onChange={onChange}
                      id="auth-login-v2-password"
                      error={Boolean(loginForm.formState.errors.senha)}
                      {...(loginForm.formState.errors.senha && {
                        helperText: loginForm.formState.errors.senha.message,
                      })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize="1.25rem" icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <FormControlLabel
                  label={translate('global.rememberMe')}
                  control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                />
                <Typography
                  sx={{textDecoration: 'none', color: theme.palette.primary.main, cursor: 'pointer'}}
                  onClick={() => setShowModal(true)}
                >
                  {translate('buttons.forgotPassword')}
                </Typography>
              </Box>
              <Button fullWidth type="submit" variant="contained" sx={{mb: 4}}>
                {translate('buttons.login')}
              </Button>
            </form>
          </Box>
        </Box>
      </RightWrapper>

      <DefaultModalGeneric onClose={() => setShowModal(false)} show={showModal} title="global.resetPassword">
        <form noValidate autoComplete="off" onSubmit={resetPasswordForm.handleSubmit(resetPassword)}>
          <GridTextField
            control={resetPasswordForm.control}
            fieldName="email"
            label="global.email"
            sm={12}
            errors={resetPasswordForm.formState.errors}
          />
          <Box sx={{...flexGenerator('r.center.center'), marginTop: 5}}>
            <Button type="submit" variant="contained" sx={{mb: 4}}>
              {translate('global.reset')}
            </Button>
          </Box>
        </form>
      </DefaultModalGeneric>
    </Box>
  );
}
