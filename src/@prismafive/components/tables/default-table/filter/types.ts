import {ReactElement} from 'react';

export interface FilterProps {
  value: string;
  placeHolder: string;
  onChange: (value: string) => void;
  renderAfterSearch?: () => ReactElement;
  isLoading?: boolean;
  hideFilter?: boolean;
}
