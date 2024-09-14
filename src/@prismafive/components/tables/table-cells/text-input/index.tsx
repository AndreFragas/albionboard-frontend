import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {ChangeEvent, useEffect, useState} from 'react';
import {formatInfinityDecimal, formatMoney} from 'src/@prismafive/helper/formatters';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {TableCellTextInputProps} from './types';

export function TableCellTextInput(props: TableCellTextInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const currency = getLocalStorage(window, 'currency');

  useEffect(() => {
    if (!props.value) return;
    if (props.numberFormatterTwoDecimal) {
      setInternalValue(formatMoney(props.value));
    } else if (props.numberFormatterInfinityDecimal) {
      setInternalValue(formatInfinityDecimal(props.value, props.maxDecimal, props.maxInteger));
    } else {
      setInternalValue(props.value);
    }
  }, [props.value]);

  function handleOnChangeText(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (props.numberFormatterTwoDecimal) {
      let newValue = formatMoney(event.target.value);
      const splited = newValue.split(',');
      setInternalValue(newValue);
      props.onChange(`${splited[0].replaceAll('.', '')}.${splited[1]}`);
    } else if (props.numberFormatterInfinityDecimal) {
      setInternalValue(formatInfinityDecimal(event.target.value, props.maxDecimal, props.maxInteger));
      props.onChange(formatInfinityDecimal(event.target.value, props.maxDecimal, props.maxInteger));
    } else {
      if (props.textInputType === 'number') {
        let parsed = parseFloat(event.target.value);
        if (Number.isNaN(parsed)) {
          setInternalValue(event.target.value);
        }
        if (props.minNumber && parsed < props.minNumber) parsed = 0;
        if (props.maxNumber && parsed > props.maxNumber) parsed = 100;
        setInternalValue(parsed.toString());
        props.onChange(parsed.toString());
      } else {
        setInternalValue(event.target.value);
        props.onChange(event.target.value);
      }
    }
  }

  return (
    <Box>
      {props.currency && internalValue !== '' && <Typography>{currency}</Typography>}
      <TextField
        type={props.textInputType}
        onChange={handleOnChangeText}
        value={internalValue}
        disabled={props.readonly}
        placeholder={props.placeHolder}
        inputProps={{maxLength: props.maxSize}}
        variant="standard"
      />
    </Box>
  );
}
