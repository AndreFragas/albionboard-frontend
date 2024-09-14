import Box, {BoxProps} from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {PropsWithChildren} from 'react';
import Icon from 'src/@core/components/icon';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {RightDrawerProps} from './types';

export function RightDrawer(props: PropsWithChildren<RightDrawerProps>) {
  const {translate} = useTranslate();
  const Header = styled(Box)<BoxProps>(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between',
  }));

  return (
    <Drawer
      open={props.show}
      anchor="right"
      variant="temporary"
      onClose={props.onClose}
      ModalProps={{keepMounted: true}}
      sx={{'& .MuiDrawer-paper': {width: {xs: 300, sm: 400}}}}
    >
      <Header>
        <Typography variant="h5">{translate(props.title)}</Typography>
        <IconButton
          size="small"
          onClick={props.onClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{p: (theme) => theme.spacing(0, 6, 6)}}>{props.children}</Box>
    </Drawer>
  );
}
