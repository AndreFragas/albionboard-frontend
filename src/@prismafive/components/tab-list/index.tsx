import {TabList} from '@mui/lab';
import {PropsWithChildren} from 'react';
import {TabListProps} from './types';

export function CustomTabList(props: PropsWithChildren<TabListProps>) {
  return (
    <TabList
      variant="scrollable"
      scrollButtons={false}
      onChange={(e, value) => props.setTab(value)}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        '& .MuiTab-root': {py: 3.5},
        marginBottom: 5,
      }}
    >
      {props.children}
    </TabList>
  );
}
