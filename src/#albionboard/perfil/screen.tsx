import {Box, Button, Card, CardContent, Grid, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import {TextField} from 'src/@prismafive/components/form-fields/text-field';
import {ProfileImagePicker} from 'src/@prismafive/components/profile-image-picker';
import {useToast} from 'src/@prismafive/components/toast';
import {flexGenerator} from 'src/@prismafive/helper/flex-generator';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage, setLocalStorage} from 'src/@prismafive/storage-controler';
import {useAcessosModuleApi} from '../acessos/api';
import {IUsuario} from '../acessos/types';
import {usePerfilModuleApi} from './api';
import {ChangePasswordDrawer} from './components/change-password-drawer';

const imageType = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE ?? '';
export function PerfilScreen() {
  const [foto, setFoto] = useState('');
  const [originalFoto, setOriginalFoto] = useState('');
  const [user, setUser] = useState<IUsuario>();
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const {translate} = useTranslate();
  const toast = useToast();
  const api = usePerfilModuleApi();
  const acessosApi = useAcessosModuleApi();
  const userData = getLocalStorage<IUsuario>(window, 'userData');

  useEffect(() => {
    async function init() {
      if (userData?.id) {
        const response = await api.getByIdUser(userData.id);
        if (response) {
          setUser(response);
          setOriginalName(response.nome);
          setName(response.nome);
          if (response.foto) {
            setFoto(`${imageType}${response.foto}`);
            setOriginalFoto(`${imageType}${response.foto}`);
          }
        }
      }
    }
    init();
  }, []);

  async function save() {
    return await acessosApi.editUsuarios(
      {
        id: userData?.id,
        ...(foto !== originalFoto && {foto: foto.replace(imageType, '')}),
        ...(name !== originalName && {nome: name}),
      },
      () => {
        toast.showSuccessToast('global.success.edit');
        setLocalStorage(window, 'userData', {
          ...userData,
          ...(foto !== originalFoto && {foto: foto.replace(imageType, '')}),
          ...(name !== originalName && {nome: name}),
        });
        setOriginalFoto(foto);
        setOriginalName(name);
      }
    );
  }

  return (
    <Grid container>
      <Grid item sm={4} />
      <Grid item sm={4} xs={12}>
        <Card>
          <Box sx={{...flexGenerator('r.center.center'), width: '100%', marginTop: 5}}>
            <Typography fontSize={30}>{translate('topbar.user.profile')}</Typography>
          </Box>
          <CardContent>
            <Box sx={{...flexGenerator('r.center.center')}}>
              <ProfileImagePicker image={foto} setImage={setFoto} />
            </Box>

            <Box sx={{...flexGenerator('c.center.flex-start'), marginTop: 5}}>
              <Grid container spacing={5}>
                <Grid item sm={12}>
                  <TextField label="global.name" value={name} onChange={setName} />
                </Grid>
                <Grid item sm={12}>
                  <TextField
                    label="global.group"
                    value={!user ? '' : user?.admin ? translate('global.admin') : user?.grupo_usuario?.nome}
                    disabled
                  />
                </Grid>
                <Grid item sm={12}>
                  <Box sx={{...flexGenerator('r.center.center')}}>
                    <Button onClick={() => setShowChangePassword(true)}>{translate('global.changePassword')}</Button>
                  </Box>
                </Grid>
                {(foto !== originalFoto || name !== originalName) && (
                  <Grid item sm={12}>
                    <Box sx={{...flexGenerator('r.center.center')}}>
                      <Button variant="contained" onClick={save}>
                        {translate('global.save')}
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sm={4} />
      <ChangePasswordDrawer
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        userId={user?.id ?? ''}
      />
    </Grid>
  );
}
