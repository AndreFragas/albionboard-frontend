import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import * as yup from 'yup';

const defaultValues = {
  newPassword: '',
  confirmNewPassword: '',
  currentPassword: '',
};

export function useChangePasswordFormConfig() {
  const {translate} = useTranslate();
  const schema = yup.object().shape({
    newPassword: yup.string().required().label(translate('profile.newPassword')),
    confirmNewPassword: yup.string().required().label(translate('profile.newPasswordConfirm')),
    currentPassword: yup.string().required().label(translate('profile.currentPassword')),
  });

  return {
    schema,
    defaultValues,
  };
}

export type ChangePasswordFormType = Partial<typeof defaultValues> & Record<string, any>;
