import {Grid} from '@mui/material';
import TextField from '@mui/material/TextField';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {GridTextBoxProps} from './type';

export function GridTextBox(props: GridTextBoxProps) {
  const {translate} = useTranslate();

  function hasError() {
    if (props.errors) {
      if (props.errors[props.fieldName]?.message) return props.errors[props.fieldName].message as string;
    }
    return '';
  }

  function isDisabled() {
    if (typeof props.disabled !== 'undefined') {
      return props.disabled;
    }
    if (typeof props.formType !== 'undefined') {
      return props.formType === 'details';
    }

    return false;
  }

  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm ?? 12} sx={props.sx}>
      <Controller
        name={props.fieldName}
        control={props.control}
        render={({field: {value, onChange, onBlur}}) => {
          return (
            <TextField
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              disabled={isDisabled()}
              maxRows={props.maxRow}
              rows={props.rows ?? 5}
              multiline
              variant={props.variant ?? 'outlined'}
              fullWidth
              autoFocus={props.autoFocus}
              label={
                props.disableLowercaseExceptFirstLetter
                  ? translate(props.label)
                  : lowercaseExceptFirstLetter(translate(props.label))
              }
              error={hasError() !== ''}
              helperText={hasError()}
            />
          );
        }}
      />
    </Grid>
  );
}
