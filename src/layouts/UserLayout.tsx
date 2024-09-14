import {Theme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ReactNode} from 'react';
import {useSettings} from 'src/@core/hooks/useSettings';
import Layout from 'src/@core/layouts/Layout';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import HorizontalAppBarContent from './components/horizontal/AppBarContent';
import VerticalAppBarContent from './components/vertical/AppBarContent';

interface Props {
  children: ReactNode;
  contentHeightFixed?: boolean;
}

const UserLayout = ({children, contentHeightFixed}: Props) => {
  const {settings, saveSettings} = useSettings();
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical';
  }

  const navItems = getLocalStorage(window, 'partnerMenuItems');

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {navItems: navItems},
        appBar: {
          content: (props) => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          ),
        },
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {navItems: navItems},
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />,
          },
        },
      })}
    >
      {children}
    </Layout>
  );
};

export default UserLayout;
