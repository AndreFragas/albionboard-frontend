import {SxProps, Theme} from '@mui/material';
import {ReactElement} from 'react';

export interface DefaultModalGenericProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  fullscreen?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sx?: SxProps<Theme>;
  titleComponent?: () => ReactElement;
}
