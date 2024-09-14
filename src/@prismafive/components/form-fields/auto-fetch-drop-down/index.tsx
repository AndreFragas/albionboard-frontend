import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Box} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {debounce} from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useApi} from 'src/@prismafive/hooks/use-api';
import {useReload} from 'src/@prismafive/hooks/use-reload';
import {useStateWithHistory} from 'src/@prismafive/hooks/use-state-with-history';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {RoundPrimaryAddButton} from '../../buttons/round-primary-add-button';
import {SmallLoader} from '../../small-loader';
import {IPagination, ListaPaginacaoResponse} from '../../tables/auto-fetch-table/types';
import {DropDownProps} from './types';

const delay = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_DROPDOWN_DELAY ?? '500');
const pageSize = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_DROPDOWN_PAGESIZE ?? '50');
const minStringSize = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_DROPDOWN_MIN_STRING_SIZE ?? '1');
export function AutoFetchDropDown(props: DropDownProps) {
  const getData = useApi<ListaPaginacaoResponse>('GET', `${props.route}`, {
    setLoading: false,
  });
  const [data, setData] = useStateWithHistory({values: [] as any[]});
  const [finishedRender, setFinishedRender] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useStateWithHistory({
    page: 1,
    pagesize: pageSize,
    asc: 'ASC',
    sortBy: props.sortBy ?? props.filterBy,
    search: '',
  } as IPagination);
  const {reload} = useReload();
  const {translate} = useTranslate();

  useEffect(() => {
    updateData(pagination, [], props.extraParams, props.excludeIds);
    setFinishedRender(true);
  }, []);

  useEffect(() => {
    if (finishedRender && props.extraParams) {
      updateData(pagination, [], props.extraParams, props.excludeIds);
    }
  }, [reload]);

  useEffect(() => {
    if (finishedRender) callUpdateData(pagination, data.values, props.extraParams, props.excludeIds);
  }, [pagination.page]);

  useEffect(() => {
    if (tempSearch === '') {
      setPagination({page: 1});
    }
    if (tempSearch.length > 0 && tempSearch.length < minStringSize) return;
    if (finishedRender) {
      handleInputChange({...pagination, search: tempSearch, page: 1}, [], props.extraParams, props.excludeIds);
    }
  }, [tempSearch]);

  async function updateData(
    newPagination: IPagination,
    previousData: any[],
    extraParams?: Record<string, any>,
    excludeIds?: any[]
  ) {
    if (props.disabled) return;
    setIsLoading(true);
    const additionalData = await getData.fetch({dynamicParams: {...newPagination, ...extraParams}});
    if (!additionalData || !additionalData.payload) return;
    setPageCount(additionalData.totalPages);
    let newData = [...previousData, ...additionalData.payload];
    if (excludeIds) {
      newData = newData.filter((item) => !excludeIds?.includes(item.id));
    }
    setData({values: newData});
    setIsLoading(false);
  }

  const callUpdateData = useCallback(
    debounce(
      (newPagination: IPagination, previousData: any[], extraParams?: Record<string, any>, excludeIds?: any[]) => {
        updateData(newPagination, previousData, extraParams, excludeIds);
      },
      delay
    ),
    []
  );

  const handleInputChange = useCallback(
    (newPagination: IPagination, previousData: any[], extraParams?: Record<string, any>, excludeIds?: any[]) => {
      setPagination(newPagination);
      callUpdateData(newPagination, previousData, extraParams, excludeIds);
    },
    [callUpdateData]
  );

  const handleScroll = (event: any) => {
    const dropdown = event.target;
    if (dropdown) {
      const {scrollTop, scrollHeight, clientHeight} = dropdown;
      if (Math.abs(scrollHeight - scrollTop - clientHeight) <= 1) {
        if (pagination.page !== pageCount) {
          setPagination({page: pagination.page + 1});
        }
      }
    }
  };

  return (
    <Tooltip title={props.value && props.value[props.filterBy]}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Box sx={{width: props.setIncludeButton ? '95%' : '100%'}}>
          <Autocomplete
            value={props.value}
            options={data.values}
            getOptionLabel={(option) =>
              props.fieldValueBuilder ? props.fieldValueBuilder(option) : option[props.filterBy] || ''
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  props.disableLowercaseExceptFirstLetter
                    ? translate(props.label ?? '')
                    : lowercaseExceptFirstLetter(translate(props.label ?? ''))
                }
                error={typeof props.error === 'string' && props.error !== ''}
                helperText={<>{translate(props.error ?? '')}</>}
              />
            )}
            fullWidth
            onChange={(e: any, newValue: any | null) => {
              props.onChange && props.onChange(newValue);
              setTempSearch('');
            }}
            onInputChange={(event, newInputValue) => {
              if (event === null) return;
              setTempSearch(newInputValue);
            }}
            disabled={props.disabled}
            ListboxProps={{onScroll: handleScroll}}
            noOptionsText={translate('components.formField.errors.noOptions')}
            PopperComponent={props.disabled ? () => <></> : undefined}
            popupIcon={isLoading ? <SmallLoader /> : <ArrowDropDownIcon />}
            disableClearable={props.disableClearable}
          />
        </Box>
        {props.setIncludeButton && (
          <RoundPrimaryAddButton
            onClick={() => props.setIncludeButton && props.setIncludeButton(true)}
            margin="0px 0px 0px 15px"
          />
        )}
      </Box>
    </Tooltip>
  );
}
