import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {styled, useTheme} from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import {useSettings} from 'src/@core/hooks/useSettings';
import logo from 'public/images/icone-albion.png';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import themeConfig from 'src/configs/themeConfig';

const LinkStyled = styled(Link)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8),
}));

const BlankLayoutAppBar = () => {
  const theme = useTheme();
  const {settings} = useSettings();
  const {skin} = settings;
  const empresa = getLocalStorage(window, 'empresa');
  const companyLogo = empresa?.config_empresa?.logo
    ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${empresa?.config_empresa?.logo}`
    : logo;
  const isIntranet = window.location.href.includes('intranet');

  return (
    <AppBar
      color="default"
      position="sticky"
      elevation={skin === 'bordered' ? 0 : 3}
      sx={{
        backgroundColor: 'background.paper',
        ...(skin === 'bordered' && {
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          p: (theme) => `${theme.spacing(0, 6)} !important`,
          minHeight: `${(theme.mixins.toolbar.minHeight as number) - (skin === 'bordered' ? 1 : 0)}px !important`,
        }}
      >
        <LinkStyled href="/home">
          <Image src={companyLogo} alt="" width={34} height={34} />
          <Typography variant="h4" sx={{ml: 2.5, fontWeight: 700, lineHeight: '24px'}}>
            {isIntranet ? themeConfig.templateName : themeConfig.templateName}
          </Typography>
        </LinkStyled>
      </Toolbar>
    </AppBar>
  );
};

export default BlankLayoutAppBar;
