import {useTheme} from '@mui/material/styles';
import Icon from 'src/@core/components/icon';
import {blackOrWhite} from 'src/@prismafive/helper/black-or-white';
import {RoundPrimaryAddButtonProps} from './types';

export function RoundPrimaryAddButton(props: RoundPrimaryAddButtonProps) {
  const theme = useTheme();
  return (
    <button
      style={{
        width: 40,
        height: 40,
        borderRadius: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        backgroundColor: theme.palette.primary.main,
        cursor: 'pointer',
        ...(props.margin && {margin: props.margin}),
      }}
      onClick={() => props.onClick && props.onClick()}
    >
      <Icon icon={'ic:baseline-plus'} fontSize={25} color={blackOrWhite(theme.palette.primary.main)} />
    </button>
  );
}
