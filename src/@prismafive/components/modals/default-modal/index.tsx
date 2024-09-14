import {Button, Card, CardContent, CardHeader} from '@mui/material';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {Box, useTheme} from '@mui/system';
import {PropsWithChildren} from 'react';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {CloseButton} from '../../buttons/close-button';
import {CenteredColumn, CenteredRow} from '../../shared-box-sx';
import {DefaultModalProps} from './types';

export function DefaultModal(props: PropsWithChildren<DefaultModalProps>) {
  const {translate} = useTranslate();
  const theme = useTheme();
  if (!props.show) return null;

  return (
    <Modal open={props.show} sx={{...CenteredColumn, padding: 10}}>
      <Card>
        <CardHeader
          title={
            <Box sx={{...CenteredRow, justifyContent: 'space-between'}}>
              <Typography fontSize={18}>{translate(props.title ?? '')}</Typography>
              <CloseButton onClick={props.onClose} />
            </Box>
          }
        />
        <CardContent sx={{width: '100%', overflow: 'auto'}}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              flex: 1,
            }}
          />
          {props.children}
          {!props.hideButtons && (
            <Box sx={{...CenteredRow, marginTop: 5, gap: 5}}>
              <Button onClick={props.onConfirm ? props.onConfirm : () => {}} variant="contained">
                {translate(props.customOnConfirmText ? props.customOnConfirmText : 'components.buttons.confirm')}
              </Button>
              <Button onClick={props.onCancel ? props.onCancel : () => {}} variant="outlined">
                {translate('components.buttons.cancel')}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Modal>
  );
}
