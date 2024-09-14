import {Drawer} from '@mui/material';
import {PropsWithChildren} from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {BottomSheetProps} from './types';

export function BottomSheet(props: PropsWithChildren<BottomSheetProps>) {
  return (
    <Drawer open={props.show} anchor="bottom">
      <PerfectScrollbar style={{height: '90vh'}}>{props.children}</PerfectScrollbar>
    </Drawer>
  );
}
