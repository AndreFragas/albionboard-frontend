import type {EmotionCache} from '@emotion/cache';
import {CacheProvider} from '@emotion/react';
import {LicenseInfo} from '@mui/x-license-pro';
import type {NextPage} from 'next';
import type {AppProps} from 'next/app';
import {Router} from 'next/router';
import NProgress from 'nprogress';
import 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';
import {ReactNode, useEffect, useState} from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'reactflow/dist/style.css';
import AclGuard from 'src/@core/components/auth/AclGuard';
import AuthGuard from 'src/@core/components/auth/AuthGuard';
import GuestGuard from 'src/@core/components/auth/GuestGuard';
import Spinner from 'src/@core/components/spinner';
import {SettingsConsumer, SettingsProvider} from 'src/@core/context/settingsContext';
import ThemeComponent from 'src/@core/theme/ThemeComponent';
import {createEmotionCache} from 'src/@core/utils/create-emotion-cache';
import {useLoader} from 'src/@prismafive/components/loader';
import {useConfirmModal} from 'src/@prismafive/components/modals/confirm-modal';
import {useToast} from 'src/@prismafive/components/toast';
import {useGlobalContext} from 'src/@prismafive/hooks/use-global-context';
import {usePreviousRoute} from 'src/@prismafive/hooks/use-previous-route';
import {useReload} from 'src/@prismafive/hooks/use-reload';
import {useUserStatistics} from 'src/@prismafive/hooks/use-user-statistics';
import {pt_BR} from 'src/@prismafive/yup-locales';
import {defaultACLObj} from 'src/configs/acl';
import 'src/configs/i18n';
import themeConfig from 'src/configs/themeConfig';
import {AuthProvider} from 'src/context/AuthContext';
import {ParametrosProvider} from 'src/context/ParamsContext';
import 'src/iconify-bundle/icons-bundle-react';
import UserLayout from 'src/layouts/UserLayout';
import {setLocale} from 'yup';
import '../../styles/globals.css';
import '../@prismafive/components/tables/default-table/default-table.css';

setLocale(pt_BR);

console.warn = console.error = () => {};

LicenseInfo.setLicenseKey(
  'fd2cb8d27eb2074505de81dfd33a4630Tz05NDMxNCxFPTE3NTI2NzMxOTQwMDAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI='
);

type ExtendedAppProps = AppProps & {
  Component: NextPage;
  emotionCache: EmotionCache;
};

type GuardProps = {
  authGuard: boolean;
  guestGuard: boolean;
  children: ReactNode;
};

const clientSideEmotionCache = createEmotionCache();

if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

const publicRoutes = ['/supplier-portal'];

const Guard = ({children, authGuard, guestGuard}: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<Spinner />}>{children}</GuestGuard>;
  } else if (!guestGuard && !authGuard) {
    return <>{children}</>;
  } else {
    return (
      <AuthGuard fallback={<Spinner />} publicRoutes={publicRoutes}>
        {children}
      </AuthGuard>
    );
  }
};

const App = (props: ExtendedAppProps) => {
  const [showChild, setShowChild] = useState(false);
  const ConfirmModal = useConfirmModal();
  const Context = useGlobalContext();
  const Reload = useReload();
  const Toast = useToast();
  const Loader = useLoader();
  const previousRoute = usePreviousRoute();
  const {saveRouteHistory} = useUserStatistics();

  useEffect(() => {
    if (previousRoute === null) return;
    saveRouteHistory(previousRoute);
  }, [previousRoute]);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  }

  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const contentHeightFixed = Component.contentHeightFixed ?? false;
  const getLayout =
    Component.getLayout ?? ((page) => <UserLayout contentHeightFixed={contentHeightFixed}>{page}</UserLayout>);
  const setConfig = Component.setConfig ?? undefined;
  const authGuard = Component.authGuard ?? true;
  const guestGuard = Component.guestGuard ?? false;
  const aclAbilities = Component.acl ?? defaultACLObj;

  return (
    <Context.Component>
      <CacheProvider value={emotionCache}>
        <SettingsProvider {...(setConfig ? {pageSettings: setConfig()} : {})}>
          <SettingsConsumer>
            {({settings}) => {
              return (
                <AuthProvider publicRoutes={publicRoutes}>
                  <ParametrosProvider>
                    <ThemeComponent settings={settings}>
                      <ConfirmModal.Component />
                      <Toast.Component />
                      <Guard authGuard={authGuard} guestGuard={guestGuard}>
                        <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard} authGuard={authGuard}>
                          <Loader.Component />
                          <Reload.Component />
                          {getLayout(<Component {...pageProps} />)}
                        </AclGuard>
                      </Guard>
                    </ThemeComponent>
                  </ParametrosProvider>
                </AuthProvider>
              );
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </CacheProvider>
    </Context.Component>
  );
};

export default App;
