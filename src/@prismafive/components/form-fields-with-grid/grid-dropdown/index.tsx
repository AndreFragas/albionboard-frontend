import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Autocomplete} from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {SmallLoader} from '../../small-loader';
import {GridDropdownProps} from './types';

export function GridDropdown(props: GridDropdownProps) {
  const {translate} = useTranslate();

  function hasError() {
    if (props.errors) {
      if (props.errors[props.fieldName]?.message) return props.errors[props.fieldName].message as string;
    }
    return '';
  }

  function isDisabled() {
    if (typeof props.disabled !== 'undefined') return props.disabled;
    if (props.formType === 'details') return true;
    return false;
  }

  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm}>
      <Controller
        name={props.fieldName}
        control={props.control}
        render={({field: {value, onChange}}) => (
          <Tooltip title={value && value[props.filterBy]}>
            <Autocomplete
              value={value}
              options={props.options}
              getOptionLabel={(option) =>
                props.renderValue
                  ? ''
                  : props.fieldValueBuilder
                  ? props.fieldValueBuilder(option)
                  : option[props.filterBy] || ''
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={lowercaseExceptFirstLetter(translate(props.label))}
                  error={hasError() !== ''}
                  helperText={hasError()}
                  variant={props.variant}
                  InputProps={{
                    ...params.InputProps,
                    ...(props.renderValue && {startAdornment: props.renderValue}),
                  }}
                />
              )}
              onChange={(e: any, newValue: any | null) => {
                onChange(newValue);
                props.additionalOnChange && props.additionalOnChange(newValue);
              }}
              disabled={isDisabled()}
              PopperComponent={isDisabled() ? () => <></> : undefined}
              popupIcon={props.showLoader ? <SmallLoader /> : <ArrowDropDownIcon />}
              renderOption={props.renderOption}
              disableClearable={props.disableClearable}
              noOptionsText={translate('components.formField.errors.noOptions')}
            />
          </Tooltip>
        )}
      />
    </Grid>
  );
}
