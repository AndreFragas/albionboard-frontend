export interface IImagePicker {
  onChange?: (value: string) => void;
  maxWidth?: number;
  maxHeight?: number;
  compressFormat?: string;
  disabled?: boolean;
}
