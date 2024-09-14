import {Box, Typography, useTheme} from '@mui/material';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {RowBoxSx} from '../shared-box-sx';
import {SpacerProps} from './types';

export function Spacer(props: SpacerProps) {
  const {translate} = useTranslate();
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...RowBoxSx,
        width: '100%',
        marginTop: props.marginTop ?? 0,
        marginBottom: props.marginBottom ?? 0,
      }}
    >
      {props.label && <Typography>{translate(props.label)}</Typography>}
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          marginLeft: props.label ? 5 : 0,
          flex: 1,
        }}
      />
    </Box>
  );
}
