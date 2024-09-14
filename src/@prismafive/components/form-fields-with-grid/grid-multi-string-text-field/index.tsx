import {Grid, Tooltip} from '@mui/material';
import {MuiChipsInput} from 'mui-chips-input';
import {useState} from 'react';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {validEmailRegex} from 'src/@prismafive/helper/regex';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {GridMultiStringTextFieldProps} from './types';

export function GridMultiStringTextField(props: GridMultiStringTextFieldProps) {
  const [targetValue, setTargetValue] = useState('');
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
    <Grid item xs={props.xs ?? 12} sm={props.sm}>
      <Controller
        name={props.fieldName}
        control={props.control}
        rules={{required: props.required}}
        render={({field: {value, onChange, onBlur}}) => (
          <Tooltip title={props.tooltip ?? ''}>
            <MuiChipsInput
              value={value}
              onChange={(event) => {
                onChange(event);
                setTargetValue('');
                props.additionalOnChange && props.additionalOnChange(event);
              }}
              onBlur={onBlur}
              disabled={isDisabled()}
              label={
                props.disableLowercaseExceptFirstLetter
                  ? translate(props.label)
                  : lowercaseExceptFirstLetter(translate(props.label))
              }
              error={hasError() !== ''}
              helperText={
                hasError() !== ''
                  ? hasError()
                  : targetValue !== ''
                  ? translate('components.warnigs.pressEnterToValidateChip')
                  : ''
              }
              fullWidth
              placeholder={isDisabled() ? '' : translate('components.formField.multiStringTextField.placeHolder')}
              disableEdition={props.disableEdition}
              inputProps={{
                maxLength: props.maxLength,
                onChange: (event: any) => setTargetValue(event.target.defaultValue),
              }}
              validate={
                props.isEmail
                  ? (chipValue) => {
                      return {
                        isError: !validEmailRegex.test(chipValue),
                        textError: translate('global.errors.invalidEmail'),
                      };
                    }
                  : undefined
              }
            />
          </Tooltip>
        )}
      />
    </Grid>
  );
}
