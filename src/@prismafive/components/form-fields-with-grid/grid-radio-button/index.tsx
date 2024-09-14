import {Grid, Typography} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {RadioButtonProps} from './types';

export function GridRadioButton(props: RadioButtonProps) {
  const {translate} = useTranslate();

  function isDisabled() {
    if (typeof props.disabled === 'boolean') return props.disabled;
    return props.formType === 'details';
  }

  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm}>
      <Typography>{lowercaseExceptFirstLetter(translate(props.label))}</Typography>
      <Controller
        name={props.fieldName}
        control={props.control}
        render={({field: {value, onChange, onBlur}}) => (
          <RadioGroup
            onChange={(event) => {
              onChange(event);
              props.additionalOnChange && props.additionalOnChange(event.target.value);
            }}
            value={value}
            row={props.row}
          >
            {props.options.map((option) => (
              <FormControlLabel
                control={<Radio />}
                value={option.value}
                label={translate(option.label)}
                disabled={isDisabled()}
                onBlur={onBlur}
                sx={{my: 0.1}}
              />
            ))}
          </RadioGroup>
        )}
      />
    </Grid>
  );
}
