import IconButtonBase from '@mui/material/IconButton';
import {PropsWithChildren} from 'react';
import {IconButtonProps} from './types';

export function IconButton(props: PropsWithChildren<IconButtonProps>) {
  return (
    <IconButtonBase
      size="small"
      onClick={props.onClick}
      sx={{
        p: '0.438rem',
        borderRadius: props.borderRadius ?? 1,
        color: 'text.primary',
        backgroundColor: 'action.selected',
        '&:hover': {
          backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
        },
        ...(props.sx && props.sx),
      }}
      disabled={props.disabled}
    >
      {props.children}
    </IconButtonBase>
  );
}
