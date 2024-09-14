//@ts-ignore
import {Box, Button, Typography} from '@mui/material';
import {useState} from 'react';
import {ColorResult, SketchPicker} from 'react-color';
import {blackOrWhite} from 'src/@prismafive/helper/black-or-white';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {ConditionalWrapper} from '../conditional-wrapper';
import {ColorPickerProps} from './types';

export const ColorPicker = (props: ColorPickerProps) => {
  const [show, setShow] = useState(false);
  const {translate} = useTranslate();

  function onChange(color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    props.setColor(color.hex);
  }

  return (
    <Box
      sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 2}}
    >
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, height: '100%'}}>
        {props.text && <Typography>{`${translate(props.text)}:`}</Typography>}
        <Button
          sx={{
            backgroundColor: props.color,
          }}
          onClick={() => setShow(!show)}
          disabled={props.disabled}
        >
          <Typography color={blackOrWhite(props.color)}>{props.color.toUpperCase()}</Typography>
        </Button>
      </Box>
      <ConditionalWrapper show={show}>
        <SketchPicker color={props.color} onChange={onChange} />
      </ConditionalWrapper>
    </Box>
  );
};
