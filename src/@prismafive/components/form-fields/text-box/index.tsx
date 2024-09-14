import TextField from '@mui/material/TextField';
import {forwardRef} from 'react';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {TextBoxProps} from './types';

export const TextBox = forwardRef<HTMLDivElement, TextBoxProps>(function (props, ref) {
  const {translate} = useTranslate();

  function error() {
    if (typeof props.error === 'string') {
      return props.error;
    }
    return '';
  }

  return (
    <div ref={ref} style={{width: '100%'}}>
      <TextField
        value={props.value}
        onChange={(e) => props.onChange && props.onChange(e.target.value)}
        disabled={props.disabled}
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
        error={error() !== ''}
        helperText={translate(error())}
        className={props.className}
        sx={props.sx}
      />
    </div>
  );
});
