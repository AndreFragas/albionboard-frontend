import {validEmailRegex} from 'src/@prismafive/helper/regex';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import * as yup from 'yup';

const resetPasswordDefaultValues = {
  email: '',
};

export function useLoginFormConfig() {
  const {translate} = useTranslate();

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .required()
      .matches(validEmailRegex, {message: translate('global.errors.invalidEmail')})
      .label(translate('global.email')),
    senha: yup.string().required().label(translate('global.password')),
  });

  const resetPasswordSchema = yup.object().shape({
    email: yup
      .string()
      .required()
      .matches(validEmailRegex, {message: translate('global.errors.invalidEmail')})
      .label(translate('global.email')),
  });

  function getLoginDefaultValues(window: Window) {
    return {
      email: getLocalStorage<string>(window, 'previousUser') ?? '',
      senha: '',
    };
  }

  return {
    loginSchema,
    getLoginDefaultValues,
    resetPasswordDefaultValues,
    resetPasswordSchema,
  };
}
