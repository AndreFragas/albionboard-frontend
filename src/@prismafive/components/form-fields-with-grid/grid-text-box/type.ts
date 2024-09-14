import {SxProps, Theme} from '@mui/material';

export interface GridTextBoxProps {
  label: string;
  fieldName: string;
  control: any;
  sm?: number;
  formType?: string;
  errors?: any;
  xs?: number;
  maxLength?: number;
  autoFocus?: boolean;
  additionalOnChange?: (value: any) => void;
  sx?: SxProps<Theme>;
  maxRow?: number;
  rows?: number;
  disabled?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  disableLowercaseExceptFirstLetter?: boolean;
}
