import Box from '@mui/material/Box';
import {Settings} from 'src/@core/context/settingsContext';
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown';
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import Autocomplete from 'src/layouts/components/Autocomplete';

interface Props {
  hidden: boolean;
  settings: Settings;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  const {hidden, settings, saveSettings} = props;
  const auth = useAuth();

  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {auth.user && (
        <>
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  );
};

export default AppBarContent;
