export interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  text?: string;
  disabled?: boolean;
}
