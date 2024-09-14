import {ReactElement} from 'react';

export interface FormCardProps {
  title?: string;
  hideReturnButton?: boolean;
  includeButton?: boolean;
  onIncludeButtonClick?: () => void;
  goBackRoute?: string;
  closeButton?: boolean;
  onClose?: () => void;
  customHeader?: () => ReactElement;
}
