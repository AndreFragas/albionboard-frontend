export interface PaginationProps {
  page: number;
  onPageChange: (value: number) => void;
  totalPages: number;
  isLoading?: boolean;
}
