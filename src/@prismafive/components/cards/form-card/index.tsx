import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import {PropsWithChildren} from 'react';
import {useNavigate} from 'src/@prismafive/hooks/use-navigate';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {CloseButton} from '../../buttons/close-button';
import {FormCardProps} from './types';

export function FormCard(props: PropsWithChildren<FormCardProps>) {
  const {translate} = useTranslate();
  const {navigate, goBack} = useNavigate();

  return (
    <Card sx={{position: 'relative'}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 5,
          maxHeight: 40,
          marginTop: 5,
        }}
      >
        {props.customHeader ? props.customHeader() : <CardHeader title={translate(props.title ?? '')} />}
        {props.closeButton && <CloseButton onClick={props.onClose} />}
        {!props.hideReturnButton && !props.closeButton && (
          <Button
            variant="outlined"
            onClick={props.goBackRoute ? () => props.goBackRoute && navigate(props.goBackRoute) : goBack}
          >
            {translate('components.buttons.back')}
          </Button>
        )}
        {props.includeButton && (
          <Button variant="outlined" onClick={props.onIncludeButtonClick}>
            {translate('components.buttons.include')}
          </Button>
        )}
      </Box>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}
