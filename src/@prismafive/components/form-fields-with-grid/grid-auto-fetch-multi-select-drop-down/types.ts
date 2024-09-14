export interface GridAutoFetchMultiSelectDropDownProps {
  label: string;
  route: string;
  filterBy: string;
  control: any;
  formType: string;
  fieldName: string;
  xs?: number;
  sm: number;
  disabled?: boolean;
  errors?: any;
  additionalOnChange?: (value: any) => void;
  setIncludeButton?: (value: boolean) => void;
  extraParams?: Record<string, any>;
  fieldValueBuilder?: (value: any) => string;
}
