import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {CheckBoxProps} from './types';

export function CheckBox(props: CheckBoxProps) {
  const {translate} = useTranslate();

  const {control, setValue} = useForm({
    mode: 'onBlur',
    defaultValues: {checkBox: props.value},
  });

  useEffect(() => {
    setValue('checkBox', props.value);
  }, [props.value]);

  return (
    <Controller
      name={'checkBox'}
      control={control}
      render={({field: {value, onChange, onBlur}}) => (
        <FormControlLabel
          disabled={props.disabled}
          checked={value}
          onChange={(event: any) => {
            if (!props.justExternalControl) onChange(event);
            props.onChange(event.target.checked);
          }}
          control={<Checkbox defaultChecked />}
          label={translate(props.label ?? '')}
          onBlur={onBlur}
          sx={props.sx}
          style={props.style}
          labelPlacement={props.labelPlacement}
        />
      )}
    />
  );
}
