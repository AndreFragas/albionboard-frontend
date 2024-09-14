import {SelectChangeEvent, Typography} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useState} from 'react';
import {PageSizeProps} from './types';

export function PageSize(props: PageSizeProps) {
  const [pageSize, setPageSize] = useState(props.pageSize.toString());

  function onChange(e: SelectChangeEvent) {
    setPageSize(e.target.value);
    props.onChange(parseInt(e.target.value));
  }

  return (
    <Select
      value={pageSize}
      onChange={(e: any) => onChange(e)}
      sx={{
        minWidth: 30,
        maxWidth: 70,
        maxHeight: 30,
        alignItems: 'center',
        marginRight: 1,
      }}
      disabled={props.isLoading}
    >
      <MenuItem value={'10'}>
        <Typography>{'10'}</Typography>
      </MenuItem>
      <MenuItem value={'20'} sx={{alignItems: 'center'}}>
        <Typography>{'20'}</Typography>
      </MenuItem>
      <MenuItem value={'30'} sx={{alignItems: 'center'}}>
        <Typography>{'30'}</Typography>
      </MenuItem>
      <MenuItem value={'50'} sx={{alignItems: 'center'}}>
        <Typography>{'50'}</Typography>
      </MenuItem>
      <MenuItem value={'100'} sx={{alignItems: 'center'}}>
        <Typography>{'100'}</Typography>
      </MenuItem>
      <MenuItem value={'250'} sx={{alignItems: 'center'}}>
        <Typography>{'250'}</Typography>
      </MenuItem>
    </Select>
  );
}
