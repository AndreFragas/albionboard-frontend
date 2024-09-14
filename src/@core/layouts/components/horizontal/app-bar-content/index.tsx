import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import {LayoutProps} from 'src/@core/layouts/types';
import logo from 'public/images/icone-albion.png';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import themeConfig from 'src/configs/themeConfig';

interface Props {
  hidden: LayoutProps['hidden'];
  settings: LayoutProps['settings'];
  saveSettings: LayoutProps['saveSettings'];
  appBarContent: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['content'];
  appBarBranding: NonNullable<NonNullable<LayoutProps['horizontalLayoutProps']>['appBar']>['branding'];
}

const LinkStyled = styled(Link)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8),
}));

const AppBarContent = (props: Props) => {
  const {appBarContent: userAppBarContent, appBarBranding: userAppBarBranding} = props;
  const isIntranet = window.location.href.includes('intranet');
  const empresa = getLocalStorage(window, 'empresa');
  const companyLogo = empresa?.config_empresa?.logo
    ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${empresa?.config_empresa?.logo}`
    : logo;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <LinkStyled href="/home">
          <Image src={companyLogo} alt="" width={34} height={34} />
          <Typography variant="h4" sx={{ml: 2.5, fontWeight: 700, lineHeight: '24px'}}>
            {isIntranet ? themeConfig.intranet : themeConfig.templateName}
          </Typography>
        </LinkStyled>
      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  );
};

export default AppBarContent;
