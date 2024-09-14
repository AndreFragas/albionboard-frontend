import {HTMLInputTypeAttribute} from 'react';

export interface TableCellTextInputProps {
  value: any;
  onChange: (value: any) => void;
  textInputType?: HTMLInputTypeAttribute;
  readonly?: boolean;
  placeHolder?: string;
  maxSize?: number;
  numberFormatterTwoDecimal?: boolean;
  numberFormatterInfinityDecimal?: boolean;
  currency?: boolean;
  maxInteger?: number;
  maxDecimal?: number;
  minNumber?: number;
  maxNumber?: number;
}
