import {ReactElement} from 'react';

export interface ConfirmModalProps {
  message?: string;
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  content?: () => ReactElement;
  hideButtons?: boolean;
  hideCancel?: boolean;
  modalWidth?: string;
  yesOrNo?: boolean;
  hideYesOrNoCancel?: boolean;
}
