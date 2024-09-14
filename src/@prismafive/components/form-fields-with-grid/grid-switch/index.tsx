import {FormControlLabel, Grid, Switch, Tooltip} from '@mui/material';
import {Controller} from 'react-hook-form';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {GridSwitchProps} from './types';

export function GridSwitch(props: GridSwitchProps) {
  const {translate} = useTranslate();

  function isDisabled() {
    if (typeof props.disabled === 'boolean') return props.disabled;
    return props.formType === 'details';
  }

  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm}>
      <Controller
        name={props.fieldName}
        control={props.control}
        render={({field: {value, onChange}}) => (
          <Tooltip title={props.tooltip ?? ''}>
            <FormControlLabel
              label={lowercaseExceptFirstLetter(translate(props.label))}
              control={
                <Switch
                  checked={value ?? false}
                  onChange={(e) => {
                    onChange(e.target.checked);
                    props.additionalOnChange && props.additionalOnChange(e.target.checked);
                  }}
                  disabled={isDisabled()}
                />
              }
            />
          </Tooltip>
        )}
      />
    </Grid>
  );
}
