import {Direction} from '@mui/material';
import {ReactNode, createContext, useEffect, useState} from 'react';
import {AppBar, ContentWidth, Footer, Mode, Skin, ThemeColor, VerticalNavToggle} from 'src/@core/layouts/types';
import {getLocalStorage, setLocalStorage} from 'src/@prismafive/storage-controler';
import themeConfig from 'src/configs/themeConfig';

export type Settings = {
  skin: Skin;
  mode: Mode;
  appBar?: AppBar;
  footer?: Footer;
  navHidden?: boolean;
  appBarBlur: boolean;
  direction: Direction;
  navCollapsed: boolean;
  themeColor: ThemeColor;
  contentWidth: ContentWidth;
  layout?: 'vertical' | 'horizontal';
  lastLayout?: 'vertical' | 'horizontal';
  verticalNavToggleType: VerticalNavToggle;
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
};

export type PageSpecificSettings = {
  skin?: Skin;
  mode?: Mode;
  appBar?: AppBar;
  footer?: Footer;
  navHidden?: boolean;
  appBarBlur?: boolean;
  direction?: Direction;
  navCollapsed?: boolean;
  themeColor?: ThemeColor;
  contentWidth?: ContentWidth;
  layout?: 'vertical' | 'horizontal';
  lastLayout?: 'vertical' | 'horizontal';
  verticalNavToggleType?: VerticalNavToggle;
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
};
export type SettingsContextValue = {
  settings: Settings;
  saveSettings: (updatedSettings: Settings) => void;
};

interface SettingsProviderProps {
  children: ReactNode;
  pageSettings?: PageSpecificSettings | void;
}

export const initialSettings: Settings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  footer: themeConfig.footer,
  layout: themeConfig.layout,
  lastLayout: themeConfig.layout,
  direction: themeConfig.direction,
  navHidden: themeConfig.navHidden,
  appBarBlur: themeConfig.appBarBlur,
  navCollapsed: themeConfig.navCollapsed,
  contentWidth: themeConfig.contentWidth,
  toastPosition: themeConfig.toastPosition,
  verticalNavToggleType: themeConfig.verticalNavToggleType,
  appBar: themeConfig.layout === 'horizontal' && themeConfig.appBar === 'hidden' ? 'fixed' : themeConfig.appBar,
};

const staticSettings = {
  appBar: initialSettings.appBar,
  footer: initialSettings.footer,
  layout: initialSettings.layout,
  navHidden: initialSettings.navHidden,
  lastLayout: initialSettings.lastLayout,
  toastPosition: initialSettings.toastPosition,
};

const restoreSettings = (): Settings | null => {
  let settings = null;

  try {
    const storedData: string | null = getLocalStorage(window, 'settings');
    const userData = getLocalStorage(window, 'userData');

    if (userData.user_config && userData.user_config?.settings) {
      settings = userData.user_config.settings;
    } else if (storedData) {
      settings = {...JSON.parse(storedData), ...staticSettings};
    } else {
      settings = initialSettings;
    }
  } catch (err) {
    console.error(err);
  }

  return settings;
};

const storeSettings = (settings: Settings) => {
  const initSettings = Object.assign({}, settings);
  delete initSettings.appBar;
  delete initSettings.footer;
  delete initSettings.layout;
  delete initSettings.navHidden;
  delete initSettings.lastLayout;
  delete initSettings.toastPosition;
  setLocalStorage(window, 'settings', initSettings);
};

export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings,
});

export const SettingsProvider = ({children, pageSettings}: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>({...initialSettings});

  useEffect(() => {
    const restoredSettings = restoreSettings();

    if (restoredSettings) {
      setSettings({...restoredSettings});
    }
    if (pageSettings) {
      setSettings({...settings, ...pageSettings});
    }
  }, [pageSettings]);

  useEffect(() => {
    if (settings.layout === 'horizontal' && settings.mode === 'semi-dark') {
      saveSettings({...settings, mode: 'light'});
    }
    if (settings.layout === 'horizontal' && settings.appBar === 'hidden') {
      saveSettings({...settings, appBar: 'fixed'});
    }
  }, [settings.layout]);

  const saveSettings = (updatedSettings: Settings) => {
    storeSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  return <SettingsContext.Provider value={{settings, saveSettings}}>{children}</SettingsContext.Provider>;
};

export const SettingsConsumer = SettingsContext.Consumer;
