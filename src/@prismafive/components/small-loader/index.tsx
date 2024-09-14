import {CircularProgress, Tooltip} from '@mui/material';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';

interface SmallLoaderProps {
  color?: string;
}

export function SmallLoader(props: SmallLoaderProps) {
  const {translate} = useTranslate();
  return (
    <Tooltip title={`${translate('global.loading')}...`}>
      <CircularProgress size={20} color={props.color as any} />
    </Tooltip>
  );
}
