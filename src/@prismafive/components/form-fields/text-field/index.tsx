import TextFieldMaterial from '@mui/material/TextField';
import {isNaN} from 'lodash';
import {useCallback, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import InputMask from 'react-input-mask';
import {cleanFormatInfinityDecimal, formatInfinityDecimal, formatMoney} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {TextFieldProps} from './types';

export function TextField(props: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isNegative, setIsNegative] = useState(false);
  const {translate} = useTranslate();
  const currency = getLocalStorage(window, 'currency') ?? 'R$';

  function fillZerosLeft(str: string, size: number) {
    while (str.length < size) {
      str = '0' + str;
    }
    return str;
  }

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === '+') {
        return props.allowNegative && isFocused && setIsNegative(false);
      }
      if (event.key === '-') {
        return props.allowNegative && isFocused && setIsNegative(true);
      }
    },
    [isNegative, isFocused]
  );

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  const maskToCurrency = ({nextState}: any) => {
    const {value} = nextState || {};
    let amountFormatted = '';
    if (typeof value === 'number') amountFormatted.toString();
    amountFormatted = value?.replace?.(/\D/g, '');

    if (amountFormatted && amountFormatted.length < 3 && amountFormatted !== '') {
      amountFormatted = fillZerosLeft(amountFormatted, 3);
    }
    if (amountFormatted && amountFormatted.length > 3) {
      if (amountFormatted[0] === '0') amountFormatted = amountFormatted.substring(1);
    }

    if (amountFormatted?.length === 2) {
      return {
        ...nextState,
        value: `${currency} ${isNegative ? '-' : ''}${amountFormatted}`,
        selection: {
          start: amountFormatted.length + (isNegative ? 4 : 3),
          end: amountFormatted.length + (isNegative ? 4 : 3),
        },
      };
    }

    const amountFormattedWithComma = amountFormatted?.replace?.(/(?=\d{2})(\d{2})$/, ',$1');
    const amountFormattedWithDot = amountFormattedWithComma?.replace?.(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    if (amountFormattedWithDot) {
      return {
        ...nextState,
        value: `${currency} ${isNegative ? '-' : ''}${amountFormattedWithDot}`,
        selection: {
          start: amountFormattedWithDot.length + (isNegative ? 4 : 3),
          end: amountFormattedWithDot.length + (isNegative ? 4 : 3),
        },
      };
    }

    return nextState;
  };

  const maskToCurrency4digits = ({nextState}: any) => {
    const {value} = nextState || {};
    let amountFormatted = '';
    if (typeof value === 'number') amountFormatted = value.toString();
    amountFormatted = value?.replace?.(/\D/g, '');

    if (amountFormatted && amountFormatted.length < 5 && amountFormatted !== '') {
      amountFormatted = fillZerosLeft(amountFormatted, 5);
    }
    if (amountFormatted && amountFormatted.length > 5) {
      if (amountFormatted[0] === '0') amountFormatted = amountFormatted.substring(1);
    }

    if (amountFormatted?.length === 4) {
      return {
        ...nextState,
        value: `${currency} ${isNegative ? '-' : ''}${amountFormatted}`,
        selection: {
          start: amountFormatted.length + (isNegative ? 4 : 3),
          end: amountFormatted.length + (isNegative ? 4 : 3),
        },
      };
    }

    const amountFormattedWithComma = amountFormatted?.replace?.(/(\d{4})$/, ',$1');
    const parts = amountFormattedWithComma.split(',');
    parts[0] = parts[0]?.replace?.(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    const amountFormattedWithDot = parts.join(',');

    if (amountFormattedWithDot) {
      return {
        ...nextState,
        value: `${currency} ${isNegative ? '-' : ''}${amountFormattedWithDot}`,
        selection: {
          start: amountFormattedWithDot.length + (isNegative ? 4 : 3),
          end: amountFormattedWithDot.length + (isNegative ? 4 : 3),
        },
      };
    }

    return nextState;
  };

  function deMaskCurrency(value: string) {
    return value
      .replaceAll(' ', '')
      .replaceAll(currency ?? '', '')
      .replaceAll('.', '')
      .replaceAll(',', '.');
  }

  function handleValue(value: any) {
    if (value === null || isNaN(value)) {
      return '';
    }
    return value;
  }

  const {control, setValue} = useForm({
    mode: 'onBlur',
    defaultValues: {textField: props.value},
  });

  useEffect(() => {
    if (props.value) {
      if (props.formatInfinityDecimal) {
        if (typeof props.value === 'number') setValue('textField', formatInfinityDecimal(props.value));
        else setValue('textField', props.value);
      } else {
        if (typeof props.value === 'number' && props.currency) {
          setValue('textField', formatMoney(props.value));
        } else setValue('textField', props.value);
      }
    }
    if (props.value === '') setValue('textField', props.value);
  }, [props.value]);

  return (
    <Controller
      name={'textField'}
      control={control}
      render={({field: {value, onChange, onBlur}}) => (
        <InputMask
          value={handleValue(value)}
          beforeMaskedStateChange={
            props.currency ? maskToCurrency : props.currency4digits ? maskToCurrency4digits : undefined
          }
          onChange={(event) => {
            if (props.formatInfinityDecimal) {
              const newValue = props.allowNegative ? event.target.value : event.target.value.replaceAll('-', '');
              onChange(formatInfinityDecimal(newValue));
              props.onChange && props.onChange(parseFloat(cleanFormatInfinityDecimal(newValue)) as any);
              props.additionalOnChange && props.additionalOnChange(parseFloat(cleanFormatInfinityDecimal(newValue)));
            } else {
              let newValue: any = event.target.value;
              if (props.maxLength && newValue && newValue.length > props.maxLength) return;
              if (props.currency || props.currency4digits) newValue = deMaskCurrency(newValue);
              if (props.inputType === 'number') {
                newValue = parseFloat(newValue);
                if (isNaN(newValue)) newValue = null;
              }
              if (props.preOnChangeValidator) {
                if (props.preOnChangeValidator(newValue)) {
                  props.onChange && props.onChange(newValue);
                  props.additionalOnChange && props.additionalOnChange(newValue);
                  onChange(newValue);
                }
              } else {
                if (props.deMask) {
                  props.additionalOnChange && props.additionalOnChange(props.deMask(newValue));
                  props.onChange && props.onChange(props.deMask(newValue));
                  onChange(props.deMask(newValue));
                } else {
                  props.onChange && props.onChange(newValue);
                  props.additionalOnChange && props.additionalOnChange(newValue);
                  onChange(newValue);
                }
              }
            }
          }}
          mask={
            props.currency || props.currency4digits
              ? `${currency} ${props.allowNegative && isNegative ? '-' : ''}999999999999999`
              : props.mask ?? ''
          }
          disabled={props.disabled}
          type={props.inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
        >
          <TextFieldMaterial
            variant={props.inputVariant ? props.inputVariant : 'outlined'}
            fullWidth
            autoFocus={props.autoFocus}
            label={props.label ? translate(props.label) : undefined}
            error={typeof props.error === 'string' && props.error !== ''}
            helperText={<>{translate(props.error ?? '')}</>}
            inputProps={{maxLength: props.maxLength}}
            sx={props.sx}
            className={props.className}
            InputProps={{
              ...(props.percentAdornment && {endAdornment: <>%</>}),
            }}
          />
        </InputMask>
      )}
    />
  );
}
