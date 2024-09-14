import {Palette} from '@mui/material';
import {Skin} from 'src/@core/layouts/types';
import {generateColorVariations} from 'src/@prismafive/helper/color';

const DefaultPalette = (mode: Palette['mode'], skin: Skin): Palette => {
  const whiteColor = '#FFF';
  const lightColor = '47, 43, 61';
  const darkColor = '208, 212, 241';
  const darkPaperBgColor = '#2F3349';
  const mainColor = mode === 'light' ? lightColor : darkColor;

  const defaultBgColor = () => {
    if (skin === 'bordered' && mode === 'light') {
      return whiteColor;
    } else if (skin === 'bordered' && mode === 'dark') {
      return darkPaperBgColor;
    } else if (mode === 'light') {
      return '#F8F7FA';
    } else return '#25293C';
  };

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8F7FA' : '#25293C',
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072',
      link: '#8377f2',
      colorStatus0: '#ff7f00',
      colorStatus1: '#4caf50',
      colorStatus2: '#2196f3',
      colorStatus3: '#ff4081',
      colorStatus4: '#ffc107',
      colorStatus5: '#795548',
      dragNDropBox: '#384EB7',
      lightGrey: '#D4D4D4',
      yellow: '#FFD966',
      brown: '#6D5402',
      colorBackGround0: '#ffd280',
      colorBackGround1: '#a6f3a6',
      colorBackGround2: '#a3d8ff',
      colorBackGround3: '#ff9bc2',
      colorBackGround4: '#ffe082',
      colorBackGround5: '#c5a391',
    },
    white: '#FFF',
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor,
    },
    primary: {
      light: generateColorVariations('#4169E1').lighter,
      main: '#4169E1',
      dark: generateColorVariations('#4169E1').darker,
      contrastText: whiteColor,
    },
    secondary: {
      light: '#B2B4B8',
      main: '#A8AAAE',
      dark: '#949699',
      contrastText: whiteColor,
    },
    error: {
      light: '#ED6F70',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: whiteColor,
    },
    warning: {
      light: '#FFAB5A',
      main: '#FF9F43',
      dark: '#E08C3B',
      contrastText: whiteColor,
    },
    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC',
      contrastText: whiteColor,
    },
    success: {
      light: '#42CE80',
      main: '#28C76F',
      dark: '#23AF62',
      contrastText: whiteColor,
    },
    tertiary: {
      light: '#8000FF',
      main: '#6200EE',
      dark: '#4400A7',
      contrastText: whiteColor,
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
    },
    text: {
      primary: `rgba(${mainColor}, 0.78)`,
      secondary: `rgba(${mainColor}, 0.68)`,
      disabled: `rgba(${mainColor}, 0.42)`,
    },
    divider: `rgba(${mainColor}, 0.16)`,
    background: {
      paper: mode === 'light' ? whiteColor : darkPaperBgColor,
      default: defaultBgColor(),
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.06)`,
      selectedOpacity: 0.06,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
  } as Palette;
};

export default DefaultPalette;
