import {PaletteMode, ThemeOptions} from '@mui/material';
import {deepmerge} from '@mui/utils';
import {Settings} from 'src/@core/context/settingsContext';
import {generateColorVariations} from 'src/@prismafive/helper/color';
import breakpoints from './breakpoints';
import overrides from './overrides';
import palette from './palette';
import shadows from './shadows';
import spacing from './spacing';
import typography from './typography';

const themeOptions = (settings: Settings, overrideMode: PaletteMode, companyColor?: string): ThemeOptions => {
  const {skin, mode, direction, themeColor} = settings;
  const mergedThemeConfig: ThemeOptions = {
    breakpoints: breakpoints(),
    direction,
    components: overrides(settings),
    palette: palette(mode === 'semi-dark' ? overrideMode : mode, skin),
    ...spacing,
    shape: {
      borderRadius: 6,
    },
    mixins: {
      toolbar: {
        minHeight: 64,
      },
    },
    shadows: shadows(mode === 'semi-dark' ? overrideMode : mode),
    typography,
  };

  const variations = companyColor && generateColorVariations(companyColor);

  const themeReturn = deepmerge(mergedThemeConfig, {
    palette: {
      primary: {
        ...(mergedThemeConfig.palette
          ? mergedThemeConfig.palette[themeColor]
          : palette(mode === 'semi-dark' ? overrideMode : mode, skin).primary),
      },
    },
  });

  if (variations) {
    return deepmerge(mergedThemeConfig, {
      palette: {
        primary: {
          light: variations.lighter,
          main: companyColor,
          dark: variations.darker,
          contrastText: variations.textColor,
        },
      },
    });
  } else {
    return themeReturn;
  }
};

export default themeOptions;
