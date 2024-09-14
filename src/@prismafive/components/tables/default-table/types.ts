import {
  DataGridProProps,
  GridColDef,
  GridColumnOrderChangeParams,
  GridColumnResizeParams,
  GridEditMode,
  GridFeatureMode,
  GridRowClassNameParams,
  GridRowIdGetter,
  GridRowParams,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import {ReactElement} from 'react';

export interface DefaultTableProps {
  columnDefinition: GridColDef | any;
  tableName?: string;
  autoHeight?: boolean;
  tableHeight?: string;
  viewHeight?: string | number;
  viewWidth?: string;
  margin?: string | number;
  rowHeight?: number;
  setFilter?: (value: string) => void;
  page?: number;
  filter?: string;
  data?: any;
  totalPages?: number;
  setPage?: (value: number) => void;
  hidePagination?: boolean;
  hideFilter?: boolean;
  onSortModelChange?: (model: GridSortModel) => void;
  pageSize?: number;
  onPageSizeChange?: (value: number) => void;
  editMode?: GridEditMode;
  checkBoxCollum?: boolean;
  getRowClassName?: (params: GridRowClassNameParams<GridValidRowModel>) => string;
  className?: string;
  isRowSelectable?: (params: GridRowParams<GridValidRowModel>) => boolean;
  onRowClick?: (params: GridRowParams) => void;
  cellBackgroundColor?: string;
  onRowChange?: (newRow: any) => void;
  setSelectedCheckBoxes?: (checked: any[]) => void;
  selectedCheckBoxes?: any[];
  sortingMode?: GridFeatureMode;
  disableColumnMenu?: boolean;
  onColumnOrderChange?: (params: GridColumnOrderChangeParams) => void;
  onColumnWidthChange?: (params: GridColumnResizeParams) => void;
  extraLayoutInfo?: Record<string, any>;
  onColumnConfigReset?: () => void;
  getRowId?: GridRowIdGetter<GridValidRowModel>;
  renderAfterSearch?: () => ReactElement;
  renderOpositeToSpeedDial?: () => ReactElement;
  disableSaveTableConfig?: boolean;
  isAutoFetch?: boolean;
  materialUiPagination?: boolean;
  columnHeaderHeight?: number;
  noPaddingCells?: boolean;
  forceExpand?: boolean;
  isLoading?: boolean;
  startPinned?: {left: string[]; right: string[]};
  getTreeDataPath?: (row: any) => string[];
  treeData?: boolean;
  groupingColDef?: DataGridProProps['groupingColDef'];
  initialState?: DataGridProProps['initialState'];
  pageSizeOptions?: number[];
  disableColumnReorder?: boolean;
  disableColumnPinning?: boolean;
}
