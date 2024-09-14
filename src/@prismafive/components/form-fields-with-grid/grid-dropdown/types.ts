import {AutocompleteRenderOptionState} from '@mui/material';
import {HTMLAttributes, ReactElement} from 'react';

export interface GridDropdownProps {
  control: any;
  formType?: string;
  fieldName: string;
  label?: string;
  xs?: number;
  sm: number;
  filterBy: string;
  options: any[];
  errors?: any;
  disabled?: boolean;
  additionalOnChange?: (value: any) => void;
  fieldValueBuilder?: (value: any) => string;
  variant?: 'standard' | 'filled' | 'outlined';
  showLoader?: boolean;
  renderOption?: (
    props: HTMLAttributes<HTMLLIElement>,
    option: any,
    state: AutocompleteRenderOptionState
  ) => ReactElement;
  renderValue?: ReactElement;
  disableClearable?: boolean;
}
