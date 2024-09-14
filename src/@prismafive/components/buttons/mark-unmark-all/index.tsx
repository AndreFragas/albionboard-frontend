import {Button, Tooltip} from '@mui/material';
import {lowercaseExceptFirstLetter} from 'src/@prismafive/helper/formatters';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {MarkUnmarkAllButtonProps} from './types';

export function MarkUnmarkAllButton(props: MarkUnmarkAllButtonProps) {
  const {translate} = useTranslate();

  function renderButton() {
    return (
      <Button variant="outlined" onClick={props.markAllState ? props.unmarkAll : props.markAll} sx={props.sx}>
        {props.markAllState
          ? lowercaseExceptFirstLetter(
              props.customUnmarkText ? translate(props.customUnmarkText) : translate('global.unmarkAll')
            )
          : lowercaseExceptFirstLetter(
              props.customMarkText ? translate(props.customMarkText) : translate('global.markAll')
            )}
      </Button>
    );
  }
  const markTooltipText = props.customMarkTooltipText
    ? translate(props.customMarkTooltipText)
    : translate('global.markAll');

  const unmarkTooltipText = props.customUnmarkTooltipText
    ? translate(props.customUnmarkTooltipText)
    : translate('global.unmarkAll');

  return (
    <>
      {props.disableTooltip ? (
        renderButton()
      ) : (
        <Tooltip title={props.markAllState ? unmarkTooltipText : markTooltipText}>{renderButton()}</Tooltip>
      )}
    </>
  );
}
