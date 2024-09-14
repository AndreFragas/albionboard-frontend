import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Box, Grid} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {debounce} from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useApi} from 'src/@prismafive/hooks/use-api';
import {useReload} from 'src/@prismafive/hooks/use-reload';
import {useStateWithHistory} from 'src/@prismafive/hooks/use-state-with-history';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {RoundPrimaryAddButton} from '../../buttons/round-primary-add-button';
import {SmallLoader} from '../../small-loader';
import {IPagination, ListaPaginacaoResponse} from '../../tables/auto-fetch-table/types';
import {GridAutoFetchMultiSelectDropDownProps} from './types';

const delay = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_MULTI_SELECT_DROPDOWN_DELAY ?? '500');
const pageSize = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_MULTI_SELECT_DROPDOWN_PAGESIZE ?? '50');
const minStringSize = parseInt(process.env.NEXT_PUBLIC_AUTO_FETCH_MULTI_SELECT_MIN_STRING_SIZE ?? '1');
export function GridAutoFetchMultiSelectDropDown(props: GridAutoFetchMultiSelectDropDownProps) {
  const getData = useApi<ListaPaginacaoResponse>('GET', `${props.route}`, {setLoading: false});
  const {reload} = useReload();
  const {translate} = useTranslate();
  const [data, setData] = useStateWithHistory({values: [] as any[]});
  const [finishedRender, setFinishedRender] = useState(false);
  const [tempSearch, setTempSearch] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useStateWithHistory({
    page: 1,
    pagesize: pageSize,
    asc: 'ASC',
    sortBy: props.filterBy,
    search: '',
  } as IPagination);

  useEffect(() => {
    updateData(pagination, []);
    setFinishedRender(true);
  }, []);

  function isDisabled() {
    if (typeof props.disabled !== 'undefined') return props.disabled;
    if (props.formType === 'details') return true;
    return false;
  }

  useEffect(() => {
    if (pagination.page === 1) return;
    if (finishedRender) callUpdateData(pagination, data.values, props.extraParams);
  }, [pagination.page]);

  useEffect(() => {
    if (finishedRender && tempSearch === '') {
      setPagination({page: 1});
    }
    if (tempSearch.length > 0 && tempSearch.length < minStringSize) return;
    if (finishedRender) {
      handleInputChange({...pagination, search: tempSearch, page: 1}, [], props.extraParams);
    }
  }, [tempSearch]);

  useEffect(() => {
    if (finishedRender && props.extraParams) {
      updateData(pagination, [], props.extraParams);
    }
  }, [reload]);

  async function updateData(newPagination: IPagination, previousData: any[], extraParams?: Record<string, any>) {
    setIsLoading(true);
    if (isDisabled()) return;
    const additionalData = await getData.fetch({
      dynamicParams: {...newPagination, ...extraParams},
    });
    if (!additionalData || !additionalData.payload) return;
    setPageCount(additionalData.totalPages);
    setData({values: [...previousData, ...additionalData.payload]});
    setIsLoading(false);
  }

  const callUpdateData = useCallback(
    debounce((newPagination: IPagination, previousData: any[], extraParams?: Record<string, any>) => {
      updateData(newPagination, previousData, extraParams);
    }, delay),
    []
  );

  const handleInputChange = useCallback(
    (newPagination: IPagination, previousData: any[], extraParams?: Record<string, any>) => {
      setPagination(newPagination);
      callUpdateData(newPagination, previousData, extraParams);
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

  function filterAlreadySelectedOptions(values: any[], options: any[]) {
    if (!values) values = [];
    const idValues = new Set(values.map((objeto) => objeto.id));
    return options.filter((objeto) => !idValues.has(objeto.id));
  }

  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm}>
      <Controller
        name={props.fieldName}
        control={props.control}
        render={({field: {value, onChange}}) => {
          return (
            <Tooltip title={value && value[props.filterBy]}>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Box sx={{width: '100%'}}>
                  <Autocomplete
                    value={value}
                    options={filterAlreadySelectedOptions(value, data.values)}
                    getOptionLabel={(option) =>
                      props.fieldValueBuilder ? props.fieldValueBuilder(option) : option[props.filterBy] || ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={lowercaseExceptFirstLetter(translate(props.label))}
                        error={props.errors && props.errors[props.fieldName]}
                        helperText={props.errors && props.errors[props.fieldName]?.message}
                      />
                    )}
                    fullWidth
                    onChange={(e: any, newValue: any | null) => {
                      onChange(newValue);
                      props.additionalOnChange && props.additionalOnChange(newValue);
                      setTempSearch('');
                    }}
                    onInputChange={(event, newInputValue) => {
                      if (event === null) return;
                      setTempSearch(newInputValue);
                    }}
                    disabled={isDisabled()}
                    ListboxProps={{onScroll: handleScroll}}
                    noOptionsText={translate('components.formField.errors.noOptions')}
                    multiple
                    PopperComponent={isDisabled() ? () => <></> : undefined}
                    filterOptions={(options) => options}
                    popupIcon={isLoading ? <SmallLoader /> : <ArrowDropDownIcon />}
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
        }}
      />
    </Grid>
  );
}
