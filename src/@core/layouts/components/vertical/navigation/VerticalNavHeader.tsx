import Box, {BoxProps} from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography, {TypographyProps} from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import Icon from 'src/@core/components/icon';
import {LayoutProps} from 'src/@core/layouts/types';
import logo from 'public/images/icone-albion.png';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import themeConfig from 'src/configs/themeConfig';

interface Props {
  navHover: boolean;
  collapsedNavWidth: number;
  hidden: LayoutProps['hidden'];
  navigationBorderWidth: number;
  toggleNavVisibility: () => void;
  settings: LayoutProps['settings'];
  saveSettings: LayoutProps['saveSettings'];
  navMenuBranding?: LayoutProps['verticalLayoutProps']['navMenu']['branding'];
  menuLockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['lockedIcon'];
  menuUnlockedIcon?: LayoutProps['verticalLayoutProps']['navMenu']['unlockedIcon'];
}

const MenuHeaderWrapper = styled(Box)<BoxProps>(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(3.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight,
}));

const HeaderTitle = styled(Typography)<TypographyProps>({
  fontWeight: 700,
  lineHeight: '24px',
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out',
});

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
});

const VerticalNavHeader = (props: Props) => {
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon,
  } = props;
  const isIntranet = window.location.href.includes('intranet');
  const {navCollapsed} = settings;
  const empresa = getLocalStorage(window, 'empresa');
  const companyLogo = empresa?.config_empresa?.logo
    ? `${process.env.NEXT_PUBLIC_DEFAULT_IMAGE_TYPE}${empresa?.config_empresa?.logo}`
    : logo;

  const menuCollapsedStyles = navCollapsed && !navHover ? {opacity: 0} : {opacity: 1};

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0;
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 34) / 8;
      }
    } else {
      return 6;
    }
  };

  const MenuLockedIcon = () => userMenuLockedIcon || <Icon icon="tabler:circle-dot" />;

  const MenuUnlockedIcon = () => userMenuUnlockedIcon || <Icon icon="tabler:circle" />;

  return (
    <MenuHeaderWrapper className="nav-header" sx={{pl: menuHeaderPaddingLeft()}}>
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <LinkStyled href="/home">
          <Image src={companyLogo} alt="" width={34} height={34} />
          <HeaderTitle
            variant="h4"
            sx={{
              ...menuCollapsedStyles,
              ...(navCollapsed && !navHover ? {} : {ml: 2.5}),
              whiteSpace: 'nowrap',
            }}
          >
            {isIntranet ? themeConfig.intranet : themeConfig.templateName}
          </HeaderTitle>
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{
            p: 0,
            color: 'text.secondary',
            backgroundColor: 'transparent !important',
          }}
        >
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </IconButton>
      ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={() => saveSettings({...settings, navCollapsed: !navCollapsed})}
          sx={{
            p: 0,
            color: 'text.primary',
            backgroundColor: 'transparent !important',
            '& svg': {
              fontSize: '1.25rem',
              ...menuCollapsedStyles,
              transition: 'opacity .25s ease-in-out',
            },
          }}
        >
          {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        </IconButton>
      )}
    </MenuHeaderWrapper>
  );
};

export default VerticalNavHeader;
