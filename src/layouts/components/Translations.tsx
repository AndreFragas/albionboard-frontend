import {useTranslation} from 'react-i18next';

interface Props {
  text: string;
  isNavigationMenu?: boolean;
}

const Translations = ({text, isNavigationMenu}: Props) => {
  const {t} = useTranslation();

  if (isNavigationMenu) {
    const splited = text.split('.');
    if (splited.length === 1)
      return <>{`${t(`navbar.modulo.${splited[0]}`)}`}</>;
    if (splited.length === 2)
      return <>{`${t(`navbar.categoria.${splited[1]}`)}`}</>;
    if (splited.length === 3)
      return <>{`${t(`navbar.programa.${splited[2]}`)}`}</>;
  }

  return <>{`${t(text)}`}</>;
};

export default Translations;
