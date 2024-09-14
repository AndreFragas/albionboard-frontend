import {Grid, useTheme} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import {useCallback, useEffect, useState} from 'react';
import {Controller} from 'react-hook-form';
import InputMask from 'react-input-mask';
import Icon from 'src/@core/components/icon';
import {
  cleanFormatInfinityDecimal,
  formatInfinityDecimal,
  lowercaseExceptFirstLetter,
} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import {GridTextFieldProps} from './types';

export function GridTextField(props: GridTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isNegative, setIsNegative] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {translate} = useTranslate();
  const theme = useTheme();
  const currency = getLocalStorage(window, 'currency') ?? 'R$';

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

  function hasError() {
    if (props.errors) {
      if (props.errors[props.fieldName]?.message) return props.errors[props.fieldName].message as string;
    }
    return '';
  }

  function fillZerosLeft(str: string, size: number) {
    while (str.length < size) {
      str = '0' + str;
    }
    return str;
  }

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
    if (value === null) {
      return '';
    }
    return value;
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
    <Grid item xs={props.xs ?? 12} sm={props.sm} sx={props.sx}>
      <Controller
        name={props.fieldName}
        control={props.control}
        rules={{required: props.required}}
        render={({field: {value, onChange, onBlur}}) => {
          return (
            <InputMask
              value={handleValue(value)}
              beforeMaskedStateChange={
                props.currency ? maskToCurrency : props.currency4digits ? maskToCurrency4digits : undefined
              }
              onChange={(event) => {
                if (props.formatInfinityDecimal) {
                  onChange(formatInfinityDecimal(event.target.value));
                  props.additionalOnChange &&
                    props.additionalOnChange(parseFloat(cleanFormatInfinityDecimal(event.target.value)));
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
                      onChange(newValue);
                      props.additionalOnChange && props.additionalOnChange(newValue);
                    }
                  } else {
                    if (props.deMask) {
                      props.additionalOnChange && props.additionalOnChange(props.deMask(newValue));
                      onChange(props.deMask(newValue));
                    } else {
                      onChange(newValue);
                      props.additionalOnChange && props.additionalOnChange(newValue);
                    }
                  }
                }
              }}
              mask={
                props.currency || props.currency4digits
                  ? `${currency} ${props.allowNegative && isNegative ? '-' : ''}999999999999999`
                  : props.mask ?? ''
              }
              disabled={isDisabled()}
              type={props.isPassword ? (showPassword ? 'text' : 'password') : props.inputType}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
                props.additionalOnChangeOnBlur && props.additionalOnChangeOnBlur(value);
              }}
            >
              <TextField
                variant={props.variant ?? 'outlined'}
                fullWidth
                autoFocus={props.autoFocus}
                label={
                  props.disableLowercaseExceptFirstLetter
                    ? translate(props.label ?? '')
                    : lowercaseExceptFirstLetter(translate(props.label ?? ''))
                }
                error={hasError() !== ''}
                helperText={hasError()}
                inputProps={{
                  maxLength: props.maxLength,
                  ...(props.allowNegative && {
                    style: {
                      color: isNegative ? theme.palette.error.main : theme.palette.success.main,
                    },
                  }),
                }}
                {...(props.isPassword && {
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon fontSize="1.25rem" icon={showPassword ? 'tabler:eye-off' : 'tabler:eye'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                })}
              />
            </InputMask>
          );
        }}
      />
    </Grid>
  );
}
