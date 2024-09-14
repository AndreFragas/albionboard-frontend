import {HTMLInputTypeAttribute} from 'react';

export interface GridMultiStringTextFieldProps {
  label: string;
  fieldName: string;
  control: any;
  sm: number;
  formType?: string;
  errors?: any;
  xs?: number;
  autoFocus?: boolean;
  additionalOnChange?: (value: any) => void;
  disabled?: boolean;
  required?: boolean;
  disableEdition?: boolean;
  maxLength?: number;
  isEmail?: boolean;
  disableLowercaseExceptFirstLetter?: boolean;
  tooltip?: string;
}
