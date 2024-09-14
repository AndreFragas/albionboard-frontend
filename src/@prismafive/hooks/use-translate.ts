import {useTranslation} from 'react-i18next';
import {lowercaseExceptFirstLetter} from '../helper/formatters';

export interface ITranslateOptions {
  i18NextOptions?: any;
  lowerExceptFirst?: boolean;
}

export function useTranslate() {
  const {t} = useTranslation();

  function translate(text?: string, options?: ITranslateOptions) {
    if (!text) return '';

    const translation = `${t(text, options?.i18NextOptions)}`;

    if (options?.lowerExceptFirst) return lowercaseExceptFirstLetter(translation);
    return translation;
  }

  return {
    translate,
  };
}
