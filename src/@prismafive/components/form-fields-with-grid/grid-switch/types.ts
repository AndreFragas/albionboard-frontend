export interface GridSwitchProps {
  control: any;
  formType?: string;
  fieldName: string;
  label: string;
  xs?: number;
  sm: number;
  additionalOnChange?: (value: any) => void;
  disabled?: boolean;
  tooltip?: string;
}
