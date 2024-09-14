import {Box, TextField} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from 'src/@core/components/icon';
import {SmallLoader} from 'src/@prismafive/components/small-loader';
import {FilterProps} from './types';

export function Filter(props: FilterProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 30,
        gap: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      {!props.hideFilter && (
        <TextField
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeHolder}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="octicon:search-24" />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      )}
      {props.renderAfterSearch && props.renderAfterSearch()}
      {props.isLoading ? <SmallLoader /> : <Box sx={{width: 20, height:20}} />}
    </Box>
  );
}
