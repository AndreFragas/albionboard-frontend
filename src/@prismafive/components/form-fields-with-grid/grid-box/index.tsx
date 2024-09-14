import {Box, Grid} from '@mui/material';
import {PropsWithChildren} from 'react';
import {GridBoxProps} from './types';

export function GridBox(props: PropsWithChildren<GridBoxProps>) {
  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm} alignContent={props.alignContent}>
      <Box sx={props.sx}>{props.children}</Box>
    </Grid>
  );
}
