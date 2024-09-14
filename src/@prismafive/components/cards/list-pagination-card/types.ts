import {Dispatch, ReactElement, SetStateAction} from 'react';

export interface ListPaginationCardProps {
  title?: string;
  tableConfig: any[];
  route: string;
  extraParams?: Record<string, any>;
  renderAfterTitle?: () => ReactElement;
  includeRoute?: string;
  setSelectedRows?: (value: any[]) => void;
  selectedRows?: any[];
  renderAfterSearch?: () => ReactElement;
  mirrorDataToState?: (data: any[]) => void;
  includePermission?: string;
  hideIncludeButton?: boolean;
  customInclude?: () => void;
  renderBelowTitle?: () => ReactElement;
  renderBeforeInclude?: () => ReactElement;
  renderOpositeToSpeedDial?: () => ReactElement;
  hideSearch?: boolean;
  ignoreSearch?: boolean;
  setIgnoreSearch?: Dispatch<SetStateAction<boolean>>;
}
