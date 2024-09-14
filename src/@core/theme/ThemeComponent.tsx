import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import {ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material/styles';
import {ReactNode} from 'react';
import {Settings} from 'src/@core/context/settingsContext';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import themeConfig from 'src/configs/themeConfig';
import Direction from 'src/layouts/components/Direction';
import themeOptions from './ThemeOptions';
import GlobalStyling from './globalStyles';

interface Props {
  settings: Settings;
  children: ReactNode;
}

const ThemeComponent = (props: Props) => {
  const companyColor: string = '#FF0000';
  const {settings, children} = props;

  let theme = createTheme(themeOptions(settings, 'light', companyColor));

  if (themeConfig.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return (
    <ThemeProvider theme={theme}>
      <Direction direction={settings.direction}>
        <CssBaseline />
        <GlobalStyles styles={() => GlobalStyling(theme) as any} />
        {children}
      </Direction>
    </ThemeProvider>
  );
};

export default ThemeComponent;
