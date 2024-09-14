import {CSSProperties} from 'react';

export interface CheckBoxProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  sx?: Record<string, any>;
  style?: CSSProperties;
  labelPlacement?: 'bottom' | 'top' | 'start' | 'end';
  justExternalControl?: boolean;
}
