import {SxProps, Theme} from '@mui/material';

export interface MarkUnmarkAllButtonProps {
  markAllState: boolean;
  markAll: () => void;
  unmarkAll: () => void;
  disableTooltip?: boolean;
  customMarkText?: string;
  customUnmarkText?: string;
  customMarkTooltipText?: string;
  customUnmarkTooltipText?: string;
  sx?: SxProps<Theme>;
}
