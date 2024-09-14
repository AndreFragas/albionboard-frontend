import {validEmailRegex} from 'src/@prismafive/helper/regex';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import * as yup from 'yup';
import {IGrupoUsuario} from '../../types';

const defaultValues = {
  nome: '',
  senha: '',
  cofirmar_senha: '',
  admin: false,
  email: '',
  grupo_usuario: null as null | IGrupoUsuario,
  telefone: '',
  ativo: true,
};

export function useUsuarioFormConfig() {
  const {translate} = useTranslate();

  function buildSchema(isAdmin: boolean, type: string) {
    return yup.object().shape({
      nome: yup.string().required().label(translate('global.name')),
      ...(type === 'create' && {
        senha: yup.string().required().label(translate('global.password')),
        cofirmar_senha: yup.string().required().label(translate('global.confirmPassword')),
        email: yup
          .string()
          .required()
          .matches(validEmailRegex, {message: translate('global.errors.invalidEmail')})
          .label(translate('global.email')),
      }),
      ...(!isAdmin && {grupo_usuario: yup.object().required().label(translate('global.userGroup'))}),
    });
  }

  return {
    buildSchema,
    defaultValues,
  };
}

export type UsuarioFormType = Partial<typeof defaultValues> & Record<string, any>;
