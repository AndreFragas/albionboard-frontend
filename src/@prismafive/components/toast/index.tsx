import {useTheme} from '@mui/material/styles';
import {ReactElement} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';

let successToast: (message: string) => void;
let errorToast: (message: string) => void;
let warningToast: (message: string) => void;
let errorTostComponent: (message: () => ReactElement) => void;
let warningTostComponent: (message: () => ReactElement) => void;

function Toaster() {
  const {translate} = useTranslate();
  const theme = useTheme();

  successToast = function successToastFunction(message: string) {
    toast.success(translate(message));
  };

  errorToast = function errorToastFunction(message: string) {
    toast.error(translate(message));
  };

  errorTostComponent = function errorToastFunction(message: () => ReactElement) {
    toast.error(message());
  };

  warningToast = function warningToastFunction(message: string) {
    toast.warning(translate(message));
  };

  warningTostComponent = function errorToastFunction(message: () => ReactElement) {
    toast.warning(message());
  };

  return (
    <ToastContainer
      position="top-center"
      toastStyle={{backgroundColor: theme.palette.background.default}}
      bodyStyle={{color: theme.palette.text.primary}}
    />
  );
}

export function useToast() {
  return {
    Component: Toaster,
    showErrorToast: (message: string) => errorToast(message),
    showSuccessToast: (message: string) => successToast(message),
    showWarningToast: (message: string) => warningToast(message),
    showErrorElementToast: (message: () => ReactElement) => errorTostComponent(message),
    showWarningElementToast: (message: () => ReactElement) => warningTostComponent(message),
  };
}
