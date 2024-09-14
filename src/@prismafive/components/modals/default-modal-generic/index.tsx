import {Box, Dialog as MuiDialog, Typography} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {PropsWithChildren, useCallback, useEffect} from 'react';
import {CloseButton} from 'src/@prismafive/components/buttons/close-button';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {DefaultModalGenericProps} from './types';

const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)',
  },
  '& .MuiDialog-paper': {
    overflow: 'auto',
    '&:not(.MuiDialog-paperFullScreen)': {},
  },
});

export function DefaultModalGeneric(props: PropsWithChildren<DefaultModalGenericProps>) {
  if (!props.show) return null;
  const {translate} = useTranslate();
  const theme = useTheme();

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (props.show && event.keyCode === 27) {
        props.onClose();
      }
    },
    [props.show]
  );

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  return (
    <Dialog
      fullWidth
      open={props.show}
      onClose={props.onClose}
      maxWidth={props.maxWidth}
      fullScreen={props.fullscreen}
      sx={props.sx}
    >
      <Box sx={{top: 0, width: '100%', position: 'sticky'}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 5,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {props.titleComponent ? (
            props.titleComponent()
          ) : (
            <Typography fontSize={20}>{translate(props.title)}</Typography>
          )}
          <Box
            sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', cursor: 'pointer'}}
            onClick={props.onClose}
          >
            <Typography sx={{marginRight: 1}}>[esc]</Typography>
            <CloseButton />
          </Box>
        </Box>
        <Box sx={{padding: 5}}>{props.children}</Box>
      </Box>
    </Dialog>
  );
}
