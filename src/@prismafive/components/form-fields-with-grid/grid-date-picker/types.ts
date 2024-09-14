export interface GridDatePickerProps {
  control: any;
  formType?: string;
  fieldName: string;
  label: string;
  xs?: number;
  sm: number;
  errors?: any;
  disabled?: boolean;
  additionalOnChange?: (value: string) => void;
  variant?: 'standard' | 'filled' | 'outlined';
  minToday?: boolean;
}
