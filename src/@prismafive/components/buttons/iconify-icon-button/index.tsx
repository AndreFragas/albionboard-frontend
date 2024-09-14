import {IconButton} from '@mui/material';
import Icon from 'src/@core/components/icon';
import {IconifyIconButtonProps} from './types';

export function IconifyIconButton(props: IconifyIconButtonProps) {
  return (
    <IconButton onClick={props.onClick} data-testid="CloseButton" className={props.className}>
      <Icon icon={props.icon} fontSize={20} color={props.color} />
    </IconButton>
  );
}
