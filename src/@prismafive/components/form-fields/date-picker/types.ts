export interface DatePickerProps {
  label?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  key?: any;
  minToday?: boolean;
}
