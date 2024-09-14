import {IconButton} from '@mui/material';
import React from 'react';
import Icon from 'src/@core/components/icon';
import {CloseButtonProps} from './types';

export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>((props, ref) => {
  const {onClick, color, ...otherProps} = props;

  return (
    <IconButton {...otherProps} ref={ref} onClick={props.onClick} data-testid="CloseButton">
      <Icon icon="tabler:x" fontSize={20} color={props.color} />
    </IconButton>
  );
});
