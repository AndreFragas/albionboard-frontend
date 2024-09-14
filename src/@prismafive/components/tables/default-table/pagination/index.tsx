import Pagination from '@mui/material/Pagination';
import {PaginationProps} from './types';

export function PaginationComponent(props: PaginationProps) {
  return (
    <Pagination
      page={props.page}
      count={props.totalPages}
      onChange={(e, p) => props.onPageChange(p)}
      variant="outlined"
      color={'primary'}
      disabled={props.isLoading}
    />
  );
}
