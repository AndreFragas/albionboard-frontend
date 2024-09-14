import {GridSortModel} from '@mui/x-data-grid-pro';
import {debounce, isEqual} from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import {useApi} from 'src/@prismafive/hooks/use-api';
import {useGlobalContext} from 'src/@prismafive/hooks/use-global-context';
import {useReload} from 'src/@prismafive/hooks/use-reload';
import {useStateWithHistory} from 'src/@prismafive/hooks/use-state-with-history';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {DefaultTable} from '../default-table';
import {AutoFetchTableProps, IPagination} from './types';

const delay = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_TABLE_DELAY ?? '500');
const pageSize = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_TABLE_PAGESIZE ?? '10');
const minStringSize = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_TABLE_MIN_STRING_SIZE ?? '1');
export function AutoFetchTable(props: AutoFetchTableProps) {
  const context = useGlobalContext();
  const contextKey = 'search_' + props.route.replaceAll('/', '_').replaceAll('-', '_');
  const contextPage = 'page_' + props.route.replaceAll('/', '_').replaceAll('-', '_');
  const contextPageSize = 'pageSize_' + props.route.replaceAll('/', '_').replaceAll('-', '_');
  const tableName = props.tableName ?? 'autoFetchTableConfig_' + props.route.replaceAll('/', '_').replaceAll('-', '_');
  const {reload} = useReload();
  const getData = useApi('GET', '', {
    setLoading: false,
    client: props.customApiClient,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [tempSearch, setTempSearch] = useState(context.getValue(contextKey) ?? '');
  const userData = getLocalStorage(window, 'userData');
  let user_config: any = {};
  if (userData.user_config) {
    user_config = userData.user_config[tableName] ?? {};
  }
  const [data, setData] = useState(undefined);
  const [finishedRender, setFinishedRender] = useState(false);
  const [lastExtraParams, setLastExtraParams] = useState(props.extraParams);
  const [isLoading, setIsLoading] = useState(false);
  const [ignoreCleanSearch, setIgnoreCleanSearch] = useState(false);
  const [pagination, setPagination] = useStateWithHistory({
    page: context.getValue(contextPage) ?? 1,
    pagesize: context.getValue(contextPageSize) ?? pageSize,
    asc: user_config.sortModel && user_config.sortModel.length !== 0 ? user_config.sortModel[0].sort : 'DESC',
    sortBy: user_config.sortModel && user_config.sortModel.length !== 0 ? user_config.sortModel[0].field : '',
    search: context.getValue(contextKey) ?? '',
  } as IPagination);

  async function updateData(newPagination: IPagination, extraParams?: any, ignoreSearch?: boolean) {
    if (props.route === '') return;
    setIsLoading(true);
    //if (newPagination.search) newPagination.search = removeAccent(newPagination.search.toLowerCase());
    if (props.noPagination) {
      const response = await getData.fetch({
        dynamicRoute: props.route,
      });
      setData(response ?? []);
      props.mirrorDataToState && props.mirrorDataToState(response ?? []);
    } else {
      if (newPagination.asc) newPagination.asc = newPagination.asc.toUpperCase();
      if (newPagination.search === '' || ignoreSearch) delete newPagination.search;
      if (newPagination.sortBy === '') delete newPagination.sortBy;

      const response = await getData.fetch({
        dynamicRoute: `${props.route}`,
        dynamicParams: extraParams ? {...newPagination, ...extraParams} : newPagination,
      });
      if (response) {
        setData(response.payload ?? []);
        props.mirrorDataToState && props.mirrorDataToState(response.payload ?? []);
        setTotalPages(response.totalPages ?? 0);
      }
    }
    setIsLoading(false);
  }

  const callUpdateData = useCallback(
    debounce((newPagination: any, extraParams?: any, ignoreSearch?: boolean) => {
      updateData(newPagination, extraParams, ignoreSearch);
    }, delay),
    []
  );

  const handleInputChange = useCallback(
    (newPagination: any, extraParams?: any, ignoreSearch?: boolean) => {
      setPagination(newPagination, extraParams, ignoreSearch);
      callUpdateData(newPagination, extraParams, ignoreSearch);
    },
    [callUpdateData]
  );

  async function onSortModelChange(model: GridSortModel) {
    if (model.length === 0) {
      return setPagination({
        asc: 'ASC',
        sortBy: '',
        page: 1,
      });
    } else {
      return setPagination({
        sortBy: model[0].field,
        asc: model[0].sort,
        page: 1,
      });
    }
  }

  useEffect(() => {
    updateData(pagination, props.extraParams);
    setFinishedRender(true);
  }, []);

  useEffect(() => {
    if (finishedRender) {
      updateData(pagination, props.extraParams);
    }
  }, [reload]);

  useEffect(() => {
    if (finishedRender) {
      tempSearch.length < minStringSize && setTempSearch('');
      callUpdateData(pagination, props.extraParams);
    }
  }, [pagination]);

  useEffect(() => {
    if (props.ignoreSearch) return;
    if (finishedRender) {
      const isEqualValues = isEqual(lastExtraParams, props.extraParams);
      if (!isEqualValues) {
        setData(undefined);
        props.mirrorDataToState && props.mirrorDataToState([]);
        setLastExtraParams(props.extraParams);
        callUpdateData(pagination, props.extraParams);
      }
    }
  }, [props.extraParams]);

  useEffect(() => {
    if (ignoreCleanSearch) return setIgnoreCleanSearch(false);
    props.setIgnoreSearch && props.setIgnoreSearch(false);
    if (tempSearch.length > 0 && tempSearch.length < minStringSize) return;
    if (tempSearch === '') context.setContext(contextKey, '');
    if (finishedRender) {
      handleInputChange({...pagination, search: tempSearch, page: 1}, props.extraParams, false);
      context.setContext(contextKey, tempSearch);
    }
  }, [tempSearch]);

  useEffect(() => {
    if (props.ignoreSearch) {
      updateData(pagination, props.extraParams, true);
      setTempSearch('');
      setIgnoreCleanSearch(true);
    }
  }, [props.ignoreSearch]);

  return (
    <DefaultTable
      tableName={tableName}
      columnDefinition={props.columns}
      data={data ?? []}
      filter={tempSearch}
      page={pagination.page}
      totalPages={totalPages}
      setPage={(value: number) => {
        context.setContext(contextPage, value);
        handleInputChange({...pagination, page: value});
      }}
      setFilter={setTempSearch}
      hideFilter={props.hideSearch ?? false}
      hidePagination={props.noPagination || totalPages === 0}
      onSortModelChange={onSortModelChange}
      pageSize={pagination.pagesize as number}
      onPageSizeChange={(value: number) => {
        context.setContext(contextPageSize, value);
        handleInputChange({...pagination, pagesize: value, page: 1});
      }}
      sortingMode="server"
      rowHeight={40}
      onColumnConfigReset={() => {
        return setPagination({
          asc: 'DESC',
          sortBy: '',
          page: 1,
        });
      }}
      setSelectedCheckBoxes={props.setSelectedRows}
      selectedCheckBoxes={props.selectedRows}
      checkBoxCollum={props.selectedRows !== undefined && props.setSelectedRows !== undefined}
      renderAfterSearch={props.renderAfterSearch}
      isAutoFetch
      isLoading={isLoading}
      renderOpositeToSpeedDial={props.renderOpositeToSpeedDial}
      {...props}
    />
  );
}
