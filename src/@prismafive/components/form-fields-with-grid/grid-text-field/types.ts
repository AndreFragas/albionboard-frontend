import {SxProps, Theme} from '@mui/material';
import {HTMLInputTypeAttribute} from 'react';

export interface GridTextFieldProps {
  label?: string;
  fieldName: string;
  control: any;
  sm: number;
  formType?: string;
  errors?: any;
  xs?: number;
  required?: boolean;
  maxLength?: number;
  preOnChangeValidator?: (value: any) => boolean;
  autoFocus?: boolean;
  mask?: string;
  deMask?: (value: any) => any;
  inputType?: HTMLInputTypeAttribute;
  additionalOnChange?: (value: any) => void;
  additionalOnChangeOnBlur?: (value: any) => void;
  currency?: boolean;
  currency4digits?: boolean;
  disabled?: boolean;
  isPassword?: boolean;
  allowNegative?: boolean;
  disableLowercaseExceptFirstLetter?: boolean;
  variant?: 'standard' | 'filled' | 'outlined';
  formatInfinityDecimal?: boolean;
  sx?: SxProps<Theme>;
}
