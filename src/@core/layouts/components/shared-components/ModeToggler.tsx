import IconButton from '@mui/material/IconButton';
import {useUsuarioModuleApi} from 'src/#albionboard/usuario/api';
import Icon from 'src/@core/components/icon';
import {Settings} from 'src/@core/context/settingsContext';
import {Mode} from 'src/@core/layouts/types';

interface Props {
  settings: Settings;
  saveSettings: (values: Settings) => void;
}

const ModeToggler = (props: Props) => {
  const {settings, saveSettings} = props;
  const userApi = useUsuarioModuleApi();
  const handleModeChange = (mode: Mode) => {
    saveSettings({...settings, mode: mode});
    userApi.editUserConfig('settings', {...settings, mode: mode});
  };
  const handleModeToggle = () => {
    if (settings.mode === 'light') {
      handleModeChange('dark' as Mode);
    } else {
      handleModeChange('light' as Mode);
    }
  };

  return (
    <IconButton color="inherit" aria-haspopup="true" onClick={handleModeToggle}>
      <Icon fontSize="1.625rem" icon={settings.mode === 'dark' ? 'tabler:sun' : 'tabler:moon-stars'} />
    </IconButton>
  );
};

export default ModeToggler;
