import {Box, Button, Card, CardContent, CardHeader, Tooltip} from '@mui/material';
import {PropsWithChildren} from 'react';
import Icon from 'src/@core/components/icon';
import {flexGenerator} from 'src/@prismafive/helper/flex-generator';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {ReportCardProps} from './types';

export function ReportCard(props: PropsWithChildren<ReportCardProps>) {
  const {translate} = useTranslate();

  return (
    <Card sx={{marginTop: 5}}>
      <Box sx={{...flexGenerator('r.center.space-between'), paddingRight: 5, maxHeight: 40, marginTop: 5}}>
        <CardHeader title={translate(props.title)} />
        <Box sx={{...flexGenerator('r.center.flex-end')}}>
          {props.downloadPDF && (
            <Tooltip title={translate('global.downloadPDF')}>
              <Button variant="outlined" sx={{padding: '4px 2px 4px 2px'}} onClick={props.downloadPDF}>
                <Icon icon={'ph:file-pdf'} fontSize={35} style={{marginLeft: 2}} color="#E93131" />
              </Button>
            </Tooltip>
          )}
          {props.downloadXLS && (
            <Tooltip title={translate('global.downloadXLS')}>
              <Button variant="outlined" sx={{marginLeft: 2, padding: '4px 2px 4px 2px'}} onClick={props.downloadXLS}>
                <Icon icon={'ph:file-xls'} fontSize={35} style={{marginLeft: 2}} color="#0A7641" />
              </Button>
            </Tooltip>
          )}
        </Box>
      </Box>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}
