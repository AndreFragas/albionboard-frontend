import {SyntheticEvent} from 'react';

export interface CheckBoxProps {
  control: any;
  formType?: string;
  fieldName: string;
  label?: string;
  sm: number;
  xs?: number;
  disabled?: boolean;
  noGrid?: boolean;
  additionalOnChange?: (value: SyntheticEvent<Element, Event>) => void;
  disableLowercaseExceptFirstLetter?: boolean;
}
