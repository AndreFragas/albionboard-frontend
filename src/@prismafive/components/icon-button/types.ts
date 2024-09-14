import {SxProps, Theme} from '@mui/material';

export interface IconButtonProps {
  onClick?: () => void;
  borderRadius?: number;
  sx?: SxProps<Theme>;
  disabled?: boolean;
}
