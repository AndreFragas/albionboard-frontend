import {AutocompleteRenderOptionState, SxProps, Theme} from '@mui/material';
import {HTMLAttributes, ReactElement} from 'react';

export interface DropdownProps {
  filterBy: string;
  options: any[];
  label?: string;
  value?: Record<string, any> | null;
  onChange?: (value: any) => void;
  error?: string | null;
  disabled?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
  sx?: SxProps<Theme>;
  disableClearable?: boolean;
  renderOption?: (
    props: HTMLAttributes<HTMLLIElement>,
    option: any,
    state: AutocompleteRenderOptionState
  ) => ReactElement;
  renderValue?: ReactElement;
  fieldValueBuilder?: (value: any) => string;
}
