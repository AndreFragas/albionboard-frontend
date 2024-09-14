import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import TableRowsIcon from '@mui/icons-material/TableRows';
import UnfoldLessDoubleIcon from '@mui/icons-material/UnfoldLessDouble';
import UnfoldMoreDoubleIcon from '@mui/icons-material/UnfoldMoreDouble';
import {SpeedDial, SpeedDialAction} from '@mui/material';
import {SmallLoader} from 'src/@prismafive/components/small-loader';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';

export function useDefaultTableConfigs() {
  const {translate} = useTranslate();

  function renderFold(dataCount: number, expand: boolean, setExpand: (value: boolean) => void) {
    if (dataCount > 10)
      return [
        {
          icon: expand ? <UnfoldLessDoubleIcon /> : <UnfoldMoreDoubleIcon />,
          name: translate(expand ? 'components.table.collapseTable' : 'components.table.expandTable'),
          action: () => setExpand(!expand),
        },
      ];

    return [];
  }

  function renderSaveTableConfig(
    saveColConfig: () => void,
    resetColConfig: () => void,
    disableSaveTableConfig?: boolean
  ) {
    if (!disableSaveTableConfig)
      return [
        {
          icon: <SaveOutlinedIcon />,
          name: translate('components.table.saveLayout'),
          action: saveColConfig,
        },
        {
          icon: <HighlightOffIcon />,
          name: translate('components.table.resetLayout'),
          action: resetColConfig,
        },
      ];
    return [];
  }

  function StyledSpeedDial(
    saveColConfig: () => void,
    resetColConfig: () => void,
    direction: string,
    expand: boolean,
    setExpand: (value: boolean) => void,
    dataCount: number,
    isLoading: boolean,
    disableSaveTableConfig?: boolean
  ) {
    const actions = [
      ...renderSaveTableConfig(saveColConfig, resetColConfig, disableSaveTableConfig),
      ...renderFold(dataCount, expand, setExpand),
    ];

    return (
      <>
        {(!disableSaveTableConfig || dataCount > 10) && (
          <SpeedDial
            icon={isLoading ? <SmallLoader color={'white'} /> : <TableRowsIcon />}
            ariaLabel=""
            direction={direction === 'right' ? 'right' : 'left'}
            sx={{
              '& .MuiFab-root': {
                width: 36,
                height: 36,
              },
            }}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        )}
      </>
    );
  }

  return {
    StyledSpeedDial,
  };
}
