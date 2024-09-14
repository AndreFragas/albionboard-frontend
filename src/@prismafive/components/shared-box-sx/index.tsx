import Box from '@mui/material/Box';
import {PropsWithChildren} from 'react';

export const CenteredRow = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};

export const CenteredColumn = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

export const RowBoxSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

export const ColumnBox = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
};

interface BoxProps {
  sx?: Record<string, any>;
}

export function RowBox(props: PropsWithChildren<BoxProps>) {
  return <Box sx={{...props.sx, ...RowBoxSx}}>{props.children}</Box>;
}
