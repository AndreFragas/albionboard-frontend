import TextField from '@mui/material/TextField';
import moment from 'moment';
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {DatePickerProps} from './types';

export function DatePicker(props: DatePickerProps) {
  const {translate} = useTranslate();
  const userSettings = getLocalStorage(window, 'settings');
  const isDark = userSettings?.mode === 'dark';

  function handleOnChange(event: any, onChange: any) {
    onChange(event.target.value);
  }

  function hasError() {
    if (props.error) {
      return props.error;
    }
    return '';
  }

  const {control, setValue} = useForm({
    mode: 'onBlur',
    defaultValues: {date: props.value},
  });

  useEffect(() => {
    setValue('date', props.value);
  }, [props.value]);

  return (
    <Controller
      name={'date'}
      control={control}
      render={({field: {value, onChange}}) => (
        <TextField
          label={translate(props.label ?? '')}
          value={value}
          onChange={(e) => {
            onChange(e);
            handleOnChange(e, props.onChange);
          }}
          disabled={props.disabled}
          fullWidth
          error={hasError() !== ''}
          helperText={props.error}
          type={'date'}
          InputLabelProps={{shrink: true}}
          InputProps={{
            style: {colorScheme: isDark ? 'dark' : 'light'},
            inputProps: {max: '9999-12-31', ...(props.minToday && {min: moment().format('YYYY-MM-DD')})},
          }}
          variant={props.variant}
          key={props.key}
        />
      )}
    />
  );
}
