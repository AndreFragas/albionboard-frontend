import {Grid} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {CheckBoxProps} from './types';

export function GridCheckBox(props: CheckBoxProps) {
  const {translate} = useTranslate();

  function isDisabled() {
    if (typeof props.disabled !== 'undefined') return props.disabled;
    if (props.formType === 'details') return true;
    return false;
  }

  if (props.noGrid) {
    return (
      <Controller
        name={props.fieldName}
        control={props.control}
        render={({field: {value, onChange, onBlur}}) => (
          <FormControlLabel
            disabled={isDisabled()}
            checked={value}
            onChange={(e) => {
              onChange(e);
              props.additionalOnChange && props.additionalOnChange(e);
            }}
            control={<Checkbox defaultChecked />}
            label={lowercaseExceptFirstLetter(translate(props.label))}
            onBlur={onBlur}
          />
        )}
      />
    );
  }

  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm}>
      <Controller
        name={props.fieldName}
        control={props.control}
        render={({field: {value, onChange, onBlur}}) => (
          <FormControlLabel
            disabled={isDisabled()}
            checked={value}
            onChange={(e) => {
              onChange(e);
              props.additionalOnChange && props.additionalOnChange(e);
            }}
            control={<Checkbox defaultChecked />}
            label={
              props.disableLowercaseExceptFirstLetter
                ? translate(props.label ?? '')
                : lowercaseExceptFirstLetter(translate(props.label ?? ''))
            }
            onBlur={onBlur}
          />
        )}
      />
    </Grid>
  );
}
