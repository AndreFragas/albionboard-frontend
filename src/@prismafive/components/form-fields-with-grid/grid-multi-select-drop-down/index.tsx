import {Box, Grid} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {Controller} from 'react-hook-form';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {GridMultiSelectDropDownProps} from './types';
import { lowercaseExceptFirstLetter } from 'src/@prismafive/helper/formatters';

export function GridMultiSelectDropDown(props: GridMultiSelectDropDownProps) {
  const {translate} = useTranslate();

  function isDisabled() {
    if (typeof props.disabled !== 'undefined') return props.disabled;
    if (props.formType === 'details') return true;
    return false;
  }

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
        render={({field: {value, onChange}}) => (
          <Tooltip title={value && value[props.filterBy]}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Box sx={{width: '100%'}}>
                <Autocomplete
                  value={value}
                  options={filterAlreadySelectedOptions(value, props.options)}
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
                  }}
                  disabled={isDisabled()}
                  noOptionsText={translate('components.formField.errors.noOptions')}
                  multiple
                  PopperComponent={isDisabled() ? () => <></> : undefined}
                />
              </Box>
            </Box>
          </Tooltip>
        )}
      />
    </Grid>
  );
}
