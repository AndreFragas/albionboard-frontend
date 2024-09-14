import {Dispatch, ReactElement, SetStateAction} from 'react';
import {MSApiTypes} from 'src/@prismafive/hooks/use-api';

export interface AutoFetchTableProps {
  autoHeight?: boolean;
  columns: any;
  route: string;
  height?: string;
  hideColumns?: any;
  customApiClient?: MSApiTypes;
  noPagination?: boolean;
  hideSearch?: boolean;
  extraParams?: Record<string, any>;
  tableName?: string;
  setSelectedRows?: (value: any[]) => void;
  selectedRows?: any[];
  renderAfterSearch?: () => ReactElement;
  mirrorDataToState?: (value: any[]) => void;
  renderOpositeToSpeedDial?: () => ReactElement;
  ignoreSearch?: boolean;
  setIgnoreSearch?: Dispatch<SetStateAction<boolean>>;
}

export interface IPagination {
  page: number;
  pagesize: number;
  asc?: string;
  sortBy?: string;
  search?: string;
}

export interface ListaPaginacaoResponse<T = any> {
  payload: T[];
  page: string;
  pageSize: string;
  total: number;
  totalPages: number;
}
