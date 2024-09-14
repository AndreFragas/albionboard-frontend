import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {TableCellCheckBoxProps} from './types';

export function TableCellCheckBox(props: TableCellCheckBoxProps) {
  return (
    <FormControlLabel
      disabled={props.readonly}
      checked={props.value}
      onChange={props.onChange}
      control={<Checkbox defaultChecked />}
      label=""
    />
  );
}
