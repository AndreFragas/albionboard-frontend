import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Modal from '@mui/material/Modal';
import {ReactElement, useState} from 'react';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import Translations from 'src/layouts/components/Translations';
import {CenteredRow} from '../../shared-box-sx';
import {ConfirmModalProps} from './types';

const defaultTitleRoute = 'components.confirmModal.defaultTitle';
let showHandler: (props: ConfirmModalProps) => void;
let hideHandler: () => void;

function ConfirmModal(): ReactElement | null {
  const {translate} = useTranslate();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});
  const [content, setContent] = useState<() => JSX.Element | undefined>();
  const [hideCancel, setHideCancel] = useState(false);
  const [yesOrNo, setYesOrNo] = useState<boolean>();
  const [hideYesOrNoCancel, setHideYesOrNoCancel] = useState<boolean>();

  showHandler = function (props: ConfirmModalProps) {
    setShowModal(true);
    setMessage(translate(props.message ?? ''));
    setTitle(props?.title ? translate(props?.title) : translate(defaultTitleRoute));
    setOnConfirm(props?.onConfirm ? () => props.onConfirm : () => {});
    setOnCancel(props?.onCancel ? () => props.onCancel : () => {});
    setContent(props?.content ? () => props.content : undefined);
    setHideCancel(props.hideCancel ?? false);
    setYesOrNo(props.yesOrNo);
    setHideYesOrNoCancel(props.hideYesOrNoCancel);
  };

  function hideHandler() {
    setShowModal(false);
    setMessage('');
    setTitle(translate(defaultTitleRoute));
    setOnCancel(() => {});
    setOnConfirm(() => {});
    setContent(undefined);
    setHideCancel(false);
    setYesOrNo(undefined);
    setHideYesOrNoCancel(undefined);
  }

  function handleConfirm() {
    onConfirm && onConfirm();
    hideHandler();
  }

  function handleCancel() {
    onCancel && onCancel();
    hideHandler();
  }

  if (!showModal) return null;

  return (
    <Modal open={showModal} onClose={setOnCancel} sx={CenteredRow}>
      <Card>
        <CardHeader title={translate(title)} />

        <CardContent>
          {message !== '' && <Translations text={message} />}
          {content && content()}
          <Box sx={{...CenteredRow, marginTop: 5}}>
            <Button onClick={handleConfirm} variant="contained" sx={{marginRight: 5}}>
              <Translations text={yesOrNo ? 'global.yes' : 'components.buttons.confirm'} />
            </Button>
            {!hideCancel && (
              <Button onClick={handleCancel} variant="outlined" sx={{marginRight: 5}}>
                <Translations text={yesOrNo ? 'global.no' : 'components.buttons.cancel'} />
              </Button>
            )}
            {yesOrNo && !hideYesOrNoCancel && (
              <Button onClick={hideHandler} variant="outlined">
                <Translations text="global.cancel" />
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
}

export function useConfirmModal() {
  return {
    Component: ConfirmModal,
    show: (props: ConfirmModalProps) => showHandler(props),
    hide: () => hideHandler(),
  };
}
