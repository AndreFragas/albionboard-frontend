export interface IconifyIconButtonProps {
  icon: BaseIconifyButtons;
  onClick?: () => void;
  color?: string;
  className?: string;
}

export enum BaseIconifyButtons {
  trash = 'bi:trash3',
}
