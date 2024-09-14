import {Autocomplete} from '@mui/material';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import {isEmpty} from 'lodash';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {DropdownProps} from './types';

export function Dropdown(props: DropdownProps) {
  const {translate} = useTranslate();

  return (
    <Tooltip title={props.value && props.value[props.filterBy]}>
      <Autocomplete
        value={props.value}
        options={props.disabled ? [] : props.options}
        getOptionLabel={(option) =>
          props.renderValue
            ? ''
            : props.fieldValueBuilder
            ? props.fieldValueBuilder(option)
            : option[props.filterBy] || ''
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={translate(props.label ?? '')}
            error={!isEmpty(props.error)}
            helperText={translate(props.error ?? '')}
            variant={props.variant}
            InputProps={{
              ...params.InputProps,
              ...(props.renderValue && {startAdornment: props.renderValue}),
            }}
          />
        )}
        onChange={(e: any, newValue: any | null) => {
          props.onChange && props.onChange(newValue);
        }}
        disabled={props.disabled}
        sx={props.sx ?? {width: '100%'}}
        PopperComponent={props.disabled ? () => <></> : undefined}
        disableClearable={props.disableClearable}
        renderOption={props.renderOption}
        noOptionsText={translate('components.formField.errors.noOptions')}
      />
    </Tooltip>
  );
}
