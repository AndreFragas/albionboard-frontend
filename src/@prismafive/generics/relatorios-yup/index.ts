import {ITranslateOptions} from 'src/@prismafive/hooks/use-translate';
import * as yup from 'yup';

export function genericYupRelatorio(
  translate: (text?: string | undefined, options?: ITranslateOptions | undefined) => string,
  otherValidations?: Record<string, any>
) {
  return yup.object().shape({
    de: yup
      .date()
      .required()
      .label(translate('global.startDate', {lowerExceptFirst: true})),
    ate: yup
      .date()
      .min(yup.ref('de'), translate('global.errors.endDateIsBeforeStartDate'))
      .required()
      .label(translate('global.endDate', {lowerExceptFirst: true})),
    ...(otherValidations && {...otherValidations}),
  });
}
