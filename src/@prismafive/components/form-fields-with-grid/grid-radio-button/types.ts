export interface RadioButtonProps {
  options: RadioButtonOptionType[];
  control: any;
  formType?: string;
  errors?: any;
  fieldName: string;
  label?: string;
  xs?: number;
  sm: number;
  additionalOnChange?: (value: any) => void;
  disabled?: boolean;
  row?: boolean;
}

export interface RadioButtonOptionType {
  label: string;
  value: any;
}
