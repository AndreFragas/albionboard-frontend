import {PaletteColor} from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor;
    customColors: {
      dark: string;
      main: string;
      light: string;
      bodyBg: string;
      trackBg: string;
      avatarBg: string;
      darkPaperBg: string;
      lightPaperBg: string;
      tableHeaderBg: string;
      link: string;
      colorStatus0: string;
      colorStatus1: string;
      colorStatus2: string;
      colorStatus3: string;
      colorStatus4: string;
      colorStatus5: string;
      dragNDropBox: string;
      lightGrey: string;
      yellow: string;
      brown: string;
      colorBackGround0: string;
      colorBackGround1: string;
      colorBackGround2: string;
      colorBackGround3: string;
      colorBackGround4: string;
      colorBackGround5: string;
    };
    white: string;
  }
  interface PaletteOptions {
    customColors?: {
      dark?: string;
      main?: string;
      light?: string;
      bodyBg?: string;
      trackBg?: string;
      avatarBg?: string;
      darkPaperBg?: string;
      lightPaperBg?: string;
      tableHeaderBg?: string;
    };
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true;
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    tonal: true;
  }
}

export {};
