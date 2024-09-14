export interface DefaultModalProps {
  show: boolean;
  title?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  hideButtons?: boolean;
  modalWidth?: string;
  closeButton?: boolean;
  outsideClickTriggerOnClose?: boolean;
  customOnConfirmText?: string;
}
