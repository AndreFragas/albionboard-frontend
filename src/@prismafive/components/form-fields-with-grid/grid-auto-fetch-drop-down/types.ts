export interface DropDownProps {
  label?: string;
  route: string;
  filterBy: string;
  sortBy?: string;
  control: any;
  formType?: string;
  fieldName: string;
  xs?: number;
  sm: number;
  disabled?: boolean;
  errors?: any;
  setIncludeButton?: (value: boolean) => void;
  fieldValueBuilder?: (value: any) => string;
  extraParams?: Record<string, any>;
  additionalOnChange?: (value: any) => void;
  excludeIds?: any[];
  disableClearable?: boolean;
}
