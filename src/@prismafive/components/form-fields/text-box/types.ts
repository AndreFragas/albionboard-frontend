import {SxProps, Theme} from '@mui/material';
import {LegacyRef} from 'react';

export interface TextBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  maxLength?: number;
  autoFocus?: boolean;
  sx?: SxProps<Theme>;
  maxRow?: number;
  rows?: number;
  disabled?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  disableLowercaseExceptFirstLetter?: boolean;
  className?: string;
}
