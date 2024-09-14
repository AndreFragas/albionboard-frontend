import axios from 'axios';
import {useRouter} from 'next/router';
import {ReactNode, createContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IUsuario} from 'src/#albionboard/acessos/types';
import {useUsuarioModuleApi} from 'src/#albionboard/usuario/api';
import {initialSettings} from 'src/@core/context/settingsContext';
import {useSettings} from 'src/@core/hooks/useSettings';
import {getLocalStorage, setLocalStorage} from 'src/@prismafive/storage-controler';
import {en_US, es_ES, pt_BR} from 'src/@prismafive/yup-locales';
import Cookies from 'universal-cookie';
import {setLocale} from 'yup';
import {AuthValuesType, ErrCallbackType, LoginParams, PartnerMenuItems, UserDataType} from './types';

const defaultProvider: AuthValuesType = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  logout: () => Promise.resolve(),
  login: () => Promise.resolve(),
  partnerMenuItems: [],
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
  publicRoutes: string[];
};

const AuthProvider = ({children, publicRoutes}: Props) => {
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user);
  const [partnerMenuItems, setPartnerMenuItems] = useState<PartnerMenuItems[] | null>(defaultProvider.partnerMenuItems);
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading);
  const {i18n} = useTranslation();
  const {saveSettings} = useSettings();
  const router = useRouter();
  const userApi = useUsuarioModuleApi();
  const cookies = new Cookies(null, {path: '/'});

  function cleanMemory() {
    localStorage.removeItem('userData');
    localStorage.removeItem('access_token');
    localStorage.removeItem('partnerMenuItems');
    localStorage.removeItem('permissions');
    localStorage.removeItem('empresa');
    localStorage.removeItem('selectedFilial');
    localStorage.removeItem('filialPermission');
    localStorage.removeItem('modulos');
    localStorage.removeItem('allFiliais');
    cookies.set('token', '');
  }

  function updateYup(lng: string) {
    if (lng === 'pt-BR') setLocale(pt_BR);
    if (lng === 'es-ES') setLocale(es_ES);
    if (lng === 'us-US') setLocale(en_US);
  }

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const access_token = getLocalStorage(window, 'access_token');
      const userData = getLocalStorage(window, 'userData');
      const lastSavedLanguage = getLocalStorage(window, 'lastSavedLanguage') ?? 'pt-BR';

      if (access_token && userData) {
        setUser(userData);
        lastSavedLanguage && i18n.changeLanguage(lastSavedLanguage);
        lastSavedLanguage && updateYup(lastSavedLanguage);
      } else {
        cleanMemory();
        handleLogout();
      }
    };

    if (!publicRoutes.includes(router.pathname)) {
      initAuth();
    }
  }, []);

  async function handleLogin(params: LoginParams, errorCallback?: ErrCallbackType) {
    setLoading(true);
    if (params.rememberMe) {
      setLocalStorage(window, 'previousUser', params.email);
    }
    await axios
      .post(
        //`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
        `http://localhost:3000/api/auth/login`,
        {email: params.email, senha: params.senha}
        //{headers: {tokenautentication: process.env.NEXT_PUBLIC_PRISMA_TOKEN}}
      )
      .then(async (response) => {
        if (!response || !response.data) return;
        const returnUrl = router.query.returnUrl;
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/home';
        setLocalStorage(window, 'empresa', response.data.empresa ?? {});
        setLocalStorage(window, 'userData', response.data.usuario ?? {});
        setLocalStorage(window, 'access_token', response.data.access_token);
        setLocalStorage(window, 'allPermissions', response.data.permissoes);
        setLocalStorage(window, 'modulos', response.data.modulos ?? []);
        setLocalStorage(window, 'currency', 'R$');
        setLocalStorage(window, 'permissions', response.data.permissoes);
        cookies.set('token', response.data.access_token);
        setUser({...response.data.usuario});
        setPartnerMenuItems(response.data.menus);
        setLocalStorage(window, 'partnerMenuItems', response.data.menus);
        if (response.data.usuario.configuracao) {
          if (response.data.usuario.configuracao.language) {
            i18n.changeLanguage(response.data.usuario.configuracao.language);
            updateYup(response.data.usuario.configuracao.language);
          }
          if (response.data.usuario.configuracao.settings) saveSettings(response.data.usuario.configuracao.settings);
        }
        router.replace(redirectURL as string);
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err);
        cleanMemory();
      });
    setLoading(false);
  }

  async function handleLogout() {
    const user = getLocalStorage<IUsuario>(window, 'userData');
    const token = getLocalStorage(window, 'access_token');
    setLoading(true);
    await axios
      .delete(
        //`${process.env.NEXT_PUBLIC_BASE_URL}/api/session/deleteByUserId/${user?.id}`,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/sessoes/${user?.id}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      )
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
    setUser(null);
    cleanMemory();
    saveSettings(initialSettings);
    router.push('/login');
    setLoading(false);
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    partnerMenuItems,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export {AuthContext, AuthProvider};
