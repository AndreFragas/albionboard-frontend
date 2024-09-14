import {SxProps, Theme} from '@mui/material';

export interface GridBoxProps {
  xs?: number;
  sm: number;
  sx?: SxProps<Theme> | undefined;
  alignContent?: string;
}
