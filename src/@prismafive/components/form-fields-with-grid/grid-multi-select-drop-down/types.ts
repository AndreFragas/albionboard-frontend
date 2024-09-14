export interface GridMultiSelectDropDownProps {
  label: string;
  filterBy: string;
  control: any;
  formType?: string;
  fieldName: string;
  options: any[];
  sm: number;
  xs?: number;
  disabled?: boolean;
  errors?: any;
  additionalOnChange?: (value: any) => void;
  fieldValueBuilder?: (value: any) => string;
}
