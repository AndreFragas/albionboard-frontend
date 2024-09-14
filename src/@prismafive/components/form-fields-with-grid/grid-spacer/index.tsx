import {Grid} from '@mui/material';
import {Spacer} from 'src/@prismafive/components/spacer';
import {GridSpacerProps} from './types';

export function GridSpacer(props: GridSpacerProps) {
  return (
    <Grid item xs={props.xs ?? 12} sm={props.sm}>
      <Spacer {...props} />
    </Grid>
  );
}
