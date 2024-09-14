import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useUsuarioModuleApi} from 'src/#albionboard/usuario/api';
import Icon from 'src/@core/components/icon';
import OptionsMenu from 'src/@core/components/option-menu';
import {Settings} from 'src/@core/context/settingsContext';
import {setLocalStorage} from 'src/@prismafive/storage-controler';
import {en_US, es_ES, pt_BR} from 'src/@prismafive/yup-locales';
import {setLocale} from 'yup';

interface Props {
  settings?: Settings;
  saveSettings?: (values: Settings) => void;
  isLogin?: boolean;
}

const LanguageDropdown = ({settings, saveSettings, isLogin}: Props) => {
  const {i18n} = useTranslation();
  const userApi = useUsuarioModuleApi();
  const handleLangItemClick = (lang: 'pt-BR' | 'en-US' | 'es-ES') => {
    i18n.changeLanguage(lang);
    setLocalStorage(window, 'lastSavedLanguage', lang);
    if (!isLogin) userApi.updateAndUpload('language', lang);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
  }, [i18n.language]);

  return (
    <OptionsMenu
      iconButtonProps={{color: 'inherit'}}
      icon={<Icon fontSize="1.625rem" icon="tabler:language" />}
      menuProps={{sx: {'& .MuiMenu-paper': {mt: 4.25, minWidth: 130}}}}
      options={[
        {
          text: 'Português',
          menuItemProps: {
            sx: {py: 2},
            selected: i18n.language === 'pt-BR',
            onClick: () => {
              setLocale(pt_BR);
              handleLangItemClick('pt-BR');
              saveSettings && saveSettings({...settings, direction: 'ltr'} as any);
            },
          },
        },
        {
          text: 'English',
          menuItemProps: {
            sx: {py: 2},
            selected: i18n.language === 'en-US',
            onClick: () => {
              setLocale(en_US);
              handleLangItemClick('en-US');
              saveSettings && saveSettings({...settings, direction: 'ltr'} as any);
            },
          },
        },
        {
          text: 'Español',
          menuItemProps: {
            sx: {py: 2},
            selected: i18n.language === 'es-ES',
            onClick: () => {
              setLocale(es_ES);
              handleLangItemClick('es-ES');
              saveSettings && saveSettings({...settings, direction: 'ltr'} as any);
            },
          },
        },
      ]}
    />
  );
};

export default LanguageDropdown;
