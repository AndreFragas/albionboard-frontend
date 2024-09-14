import {HTMLInputTypeAttribute} from 'react';

export interface TextFieldProps {
  value?: string | null;
  onChange?: (value: string) => void;
  error?: string;
  label?: string;
  maxLength?: number;
  preOnChangeValidator?: (value: any) => boolean;
  autoFocus?: boolean;
  mask?: string;
  deMask?: (value: any) => any;
  inputType?: HTMLInputTypeAttribute;
  additionalOnChange?: (value: any) => void;
  currency?: boolean;
  disabled?: boolean;
  inputVariant?: 'outlined' | 'filled' | 'standard';
  sx?: Record<string, any>;
  formatInfinityDecimal?: boolean;
  className?: string;
  currency4digits?: boolean;
  allowNegative?: boolean;
  percentAdornment?: boolean;
}
