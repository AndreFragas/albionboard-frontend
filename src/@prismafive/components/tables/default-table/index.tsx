import {Box, Grid} from '@mui/material';
import {
  DataGridPro,
  GridColumnResizeParams,
  GridColumnVisibilityModel,
  GridPinnedColumns,
  GridRowModel,
  GridRowSelectionModel,
  GridSortModel,
  esES,
  ptBR,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import {useEffect, useState} from 'react';
import {useUsuarioModuleApi} from 'src/#albionboard/usuario/api';
import {useStateWithHistory} from 'src/@prismafive/hooks/use-state-with-history';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {useWindowDimensions} from 'src/@prismafive/hooks/use-window-dimensions';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {ColumnBox} from '../../shared-box-sx';
import {useToast} from '../../toast';
import {useDefaultTableConfigs} from './configs';
import {Filter} from './filter';
import {PageSize} from './page-size';
import {PaginationComponent} from './pagination';
import {DefaultTableProps} from './types';

export function DefaultTable({
  hideFilter = true,
  hidePagination = true,
  isAutoFetch = false,
  ...props
}: DefaultTableProps) {
  const colDefinitions = getColDefinition();
  const [cols, setCols] = useStateWithHistory({values: colDefinitions[0]});
  const [hasWidthChanged, setHasWidthChanged] = useState(false);
  const [columnReset, setColumnReset] = useState(false);
  const [expand, setExpand] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const forceExpand = props.forceExpand ? true : expand;
  const {translate} = useTranslate();
  const dimensions = useWindowDimensions();
  const configs = useDefaultTableConfigs();
  const tableRef = useGridApiRef();
  const usuarioApi = useUsuarioModuleApi();
  const toast = useToast();

  useEffect(() => {
    let hasChanged = false;
    let found = false;
    let newToRender: any[] = [];

    if (props.columnDefinition.length !== cols.values.length) {
      hasChanged = true;
    } else {
      cols.values.forEach((value: any) => {
        found = false;
        props.columnDefinition.forEach((element: any) => {
          if (value.field === element.field && value.headerName === element.headerName) {
            found = true;
            newToRender.push({
              ...element,
              width: value.width,
              flex: value.flex,
            });
          }
        });
        if (!found) hasChanged = true;
      });
    }

    if (hasChanged) {
      setCols({values: props.columnDefinition});
      tableRef.current.setPinnedColumns({
        left: [],
        right: [],
      });
    } else {
      setCols({values: newToRender});
    }
  }, [props.columnDefinition]);

  useEffect(() => {
    setCols({values: props.columnDefinition});
  }, [columnReset]);

  useEffect(() => {
    const newColDefinitions = getColDefinition();
    setCols({values: newColDefinitions[0]});
    !props.disableColumnPinning &&
      newColDefinitions[1] &&
      tableRef.current.setPinnedColumns(newColDefinitions[1] ?? {});
    newColDefinitions[2] && tableRef.current.setColumnVisibilityModel(newColDefinitions[2] ?? {});
    newColDefinitions[3] && tableRef.current.setSortModel(newColDefinitions[3] ?? []);
  }, [props.tableName]);

  useEffect(() => {
    if (props.startPinned) {
      tableRef.current.setPinnedColumns(props.startPinned);
    }
    const newColDefinitions = getColDefinition();
    setCols({values: newColDefinitions[0]});
    !props.disableColumnPinning &&
      newColDefinitions[1] &&
      tableRef.current.setPinnedColumns(newColDefinitions[1] ?? {});
    newColDefinitions[2] && tableRef.current.setColumnVisibilityModel(newColDefinitions[2] ?? {});
    newColDefinitions[3] && tableRef.current.setSortModel(newColDefinitions[3] ?? []);
  }, []);

  function handleProps() {
    if (props.className) {
      return {...props};
    }
  }

  function getLocale() {
    const storedLanguage = getLocalStorage(window, 'i18nextLng');
    if (storedLanguage === 'pt-BR') {
      return ptBR.components.MuiDataGrid.defaultProps.localeText;
    }
    if (storedLanguage === 'es-ES') {
      return esES.components.MuiDataGrid.defaultProps.localeText;
    }
    return undefined;
  }

  function processRowUpdate(newRow: GridRowModel) {
    props.onRowChange && props.onRowChange(newRow);
    const updatedRow = {...newRow, isNew: false};
    return updatedRow;
  }

  function onRowSelectionModelChange(rowSelectionModel: GridRowSelectionModel) {
    props.setSelectedCheckBoxes && props.setSelectedCheckBoxes(rowSelectionModel);
  }

  function onColumnOrderChange() {
    const fieldOrder = tableRef.current.state.columns.orderedFields;
    let newCols: any[] = [];
    fieldOrder.forEach((element: string) => {
      cols.values.forEach((col: any) => {
        if (element === col.field) newCols.push(col);
      });
    });
    setCols({values: newCols});
  }

  function onColumnWidthChange(params: GridColumnResizeParams) {
    let newCols = [...cols.values];
    newCols.forEach((value, index) => {
      if (params.colDef.field === value.field) {
        newCols[index] = params.colDef;
      }
    });
    setCols({values: newCols});
    setHasWidthChanged(true);
  }

  function onPinnedColumnsChange(pinnedColumns: GridPinnedColumns) {
    tableRef.current.setPinnedColumns(pinnedColumns);
  }

  function onColumnVisibilityModelChange(model: GridColumnVisibilityModel) {
    tableRef.current.setColumnVisibilityModel(model);
  }

  async function saveColConfig() {
    if (!props.tableName) return;
    let newCols = [...cols.values];

    if (hasWidthChanged) {
      newCols.forEach((element: any) => {
        delete element.flex;
        delete element.minWidth;
        delete element.maxWidth;
        delete element.computedWidth;
        element.width = tableRef.current.state.columns.lookup[element.field].computedWidth;
      });
    } else {
      newCols.forEach((element: any) => {
        delete element.minWidth;
        delete element.maxWidth;
        delete element.computedWidth;
        if (element.flex && element.flex !== 0) {
          delete element.width;
        } else {
          delete element.flex;
          element.width = Math.round(tableRef.current.state.columns.lookup[element.field].computedWidth);
        }
      });
    }

    const newColConfig = {
      pinnedColumns: props.disableColumnPinning
        ? []
        : tableRef.current.getPinnedColumns() && Object.keys(tableRef.current.getPinnedColumns()).length !== 0
        ? tableRef.current.getPinnedColumns()
        : undefined,
      visibleColumns:
        tableRef.current.state?.columns.columnVisibilityModel &&
        Object.keys(tableRef.current.state?.columns.columnVisibilityModel).length !== 0
          ? tableRef.current.state?.columns.columnVisibilityModel
          : undefined,
      sortModel:
        tableRef.current.getSortModel() && tableRef.current.getSortModel().length !== 0
          ? tableRef.current.getSortModel()
          : undefined,
      cols: newCols,
      ...props.extraLayoutInfo,
    };

    setIsLoading(true);
    await usuarioApi.editUserConfig(props.tableName, newColConfig, () => {
      toast.showSuccessToast('components.table.saveLayoutSuccess');
      setHasWidthChanged(false);
    });
    setIsLoading(false);
  }

  async function resetColConfig() {
    if (!props.tableName) return;
    setIsLoading(true);
    await usuarioApi.editUserConfig(props.tableName, undefined, () => {
      toast.showSuccessToast('components.table.resetLayoutSuccess');
      tableRef.current.setPinnedColumns({});
      tableRef.current.setColumnVisibilityModel({});
      tableRef.current.setSortModel(props.initialState?.sorting?.sortModel ?? []);
      setColumnReset(!columnReset);
      props.onColumnConfigReset && props.onColumnConfigReset();
    });
    setIsLoading(false);
  }

  function getColDefinition() {
    const userData = getLocalStorage(window, 'userData');
    const savedConfig = userData?.user_config ? userData.user_config[props.tableName ?? 0] : undefined;
    const savedCols = savedConfig ? savedConfig.cols : undefined;
    const savedPinnedCols = savedConfig ? savedConfig.pinnedColumns : undefined;
    const savedColumnModel = savedConfig ? savedConfig.visibleColumns : undefined;
    const savedSortModel = savedConfig ? savedConfig.sortModel : undefined;
    const freshCols = props.columnDefinition;
    let finalCols = savedCols ?? freshCols;

    if (savedCols) {
      freshCols.forEach((element: any) => {
        if (element.field === 'actions' || element.valueGetter || element.renderCell || element.valueFormatter) {
          finalCols.forEach((savedCol: any, index: number) => {
            if (savedCol.field === element.field) {
              if (element.getActions) finalCols[index].getActions = element.getActions;
              if (element.valueGetter) finalCols[index].valueGetter = element.valueGetter;
              if (element.renderCell) finalCols[index].renderCell = element.renderCell;
              if (element.valueFormatter) finalCols[index].valueFormatter = element.valueFormatter;
            }
          });
        }
      });
    }

    return [finalCols, savedPinnedCols, savedColumnModel, savedSortModel];
  }

  function onSortModelChange(model: GridSortModel) {
    tableRef.current.setSortModel(model);
    props.onSortModelChange && props.onSortModelChange(model);
  }

  function renderPageSize(isLoading?: boolean) {
    return (
      <PageSize
        onChange={props.onPageSizeChange ? props.onPageSizeChange : () => {}}
        pageSize={props.pageSize ?? 10}
        isLoading={isLoading}
      />
    );
  }

  function renderPagination(isLoading?: boolean) {
    return (
      <PaginationComponent
        page={props.page ?? 1}
        onPageChange={props.setPage ? props.setPage : () => {}}
        totalPages={props.totalPages ?? 1}
        isLoading={isLoading}
      />
    );
  }

  function renderFilter(isLoading?: boolean) {
    return (
      <Filter
        onChange={props.setFilter ? props.setFilter : () => {}}
        value={props.filter ?? ''}
        placeHolder={translate('components.defaultTable.placeholder')}
        renderAfterSearch={props.renderAfterSearch}
        isLoading={isLoading}
        hideFilter={hideFilter}
      />
    );
  }

  return (
    <Box
      sx={{
        ...ColumnBox,
        ...(!forceExpand && {height: props.viewHeight ? props.viewHeight : 600}),
        '& .MuiDataGrid-main': {
          minWidth: dimensions.width < 730 ? dimensions.width * 1.5 : 0,
          margin: props.margin ?? 0,
        },
        width: '100%',
      }}
    >
      {isAutoFetch && (
        <Grid
          container
          spacing={5}
          sx={{marginBottom: 5}}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item sm={6} xs={12}>
            {renderFilter(props.isLoading)}
          </Grid>
          {!hidePagination && (
            <Grid item sm={6} xs={12}>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                {renderPageSize(props.isLoading)}
                {renderPagination(props.isLoading)}
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      <DataGridPro
        getCellClassName={props.noPaddingCells ? () => 'custom-cell-class' : undefined}
        columnHeaderHeight={props.columnHeaderHeight ?? 60}
        pagination={props.materialUiPagination}
        pageSizeOptions={props.pageSizeOptions ?? [10, 25, 50, 100]}
        hideFooter={!props.materialUiPagination}
        disableColumnFilter={typeof props.materialUiPagination === 'undefined' ? true : !props.materialUiPagination}
        sx={{width: '100%', overflow: 'hidden'}}
        apiRef={tableRef}
        columns={cols.values ?? []}
        rows={props.data ?? []}
        localeText={getLocale()}
        editMode={props.editMode}
        rowHeight={props.rowHeight ?? 52}
        disableColumnMenu={props.disableColumnMenu}
        checkboxSelection={props.checkBoxCollum ?? false}
        autoHeight={props.autoHeight}
        sortingMode={props.sortingMode ?? 'client'}
        onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        isRowSelectable={props.isRowSelectable}
        getRowClassName={props.getRowClassName}
        onRowClick={props.onRowClick}
        onRowSelectionModelChange={onRowSelectionModelChange}
        rowSelectionModel={props.selectedCheckBoxes}
        onPinnedColumnsChange={onPinnedColumnsChange}
        getRowId={props.getRowId}
        onColumnOrderChange={props.onColumnOrderChange ? props.onColumnOrderChange : onColumnOrderChange}
        onColumnWidthChange={props.onColumnWidthChange ? props.onColumnWidthChange : onColumnWidthChange}
        cellBackgroundColor={props.cellBackgroundColor}
        processRowUpdate={processRowUpdate}
        onSortModelChange={onSortModelChange}
        getTreeDataPath={props.getTreeDataPath}
        treeData={props.treeData}
        groupingColDef={props.groupingColDef}
        initialState={props.initialState}
        disableColumnReorder={props.disableColumnReorder}
        disableColumnPinning={props.disableColumnPinning}
        components={{
          NoRowsOverlay: () => <></>,
        }}
        {...handleProps()}
      />
      {props.tableName && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: props.renderOpositeToSpeedDial ? 'space-between' : 'flex-start',
            marginTop: 1,
          }}
        >
          {configs.StyledSpeedDial(
            saveColConfig,
            resetColConfig,
            'right',
            expand,
            setExpand,
            props.data ? props.data.length : 0,
            isLoading,
            props.disableSaveTableConfig
          )}
          {props.renderOpositeToSpeedDial && props.renderOpositeToSpeedDial()}
        </Box>
      )}
    </Box>
  );
}
