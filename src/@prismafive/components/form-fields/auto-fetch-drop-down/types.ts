export interface DropDownProps {
  label: string;
  route: string;
  filterBy: string;
  sortBy?: string;
  disabled?: boolean;
  setIncludeButton?: (value: boolean) => void;
  fieldValueBuilder?: (value: any) => string;
  extraParams?: Record<string, any>;
  excludeIds?: any[];
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  disableClearable?: boolean;
  disableLowercaseExceptFirstLetter?: boolean;
}
