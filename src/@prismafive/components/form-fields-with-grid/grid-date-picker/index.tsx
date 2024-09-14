import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import moment from 'moment';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {GridDatePickerProps} from './types';

export function GridDatePicker(props: GridDatePickerProps) {
  const {translate} = useTranslate();
  const userSettings = getLocalStorage(window, 'settings');
  const isDark = userSettings?.mode === 'dark';

  function handleOnChange(event: any, onChange: any) {
    onChange(event.target.value);
    props.additionalOnChange && props.additionalOnChange(event.target.value);
  }

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
          <TextField
            label={lowercaseExceptFirstLetter(translate(props.label))}
            value={value}
            onChange={(e) => handleOnChange(e, onChange)}
            disabled={isDisabled()}
            fullWidth
            error={hasError() !== ''}
            helperText={hasError()}
            type={'date'}
            InputLabelProps={{shrink: true}}
            InputProps={{
              style: {colorScheme: isDark ? 'dark' : 'light'},
              inputProps: {max: '9999-12-31', ...(props.minToday && {min: moment().format('YYYY-MM-DD')})},
            }}
            variant={props.variant}
          />
        )}
      />
    </Grid>
  );
}
