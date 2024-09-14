import {Can, useAbility} from '@casl/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import {useRouter} from 'next/router';
import {flexGenerator} from 'src/@prismafive/helper/flex-generator';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {AbilityContext} from 'src/layouts/components/acl/Can';
import {AutoFetchTable} from '../../tables/auto-fetch-table';
import {ListPaginationCardProps} from './types';

export function ListPaginationCard(props: ListPaginationCardProps) {
  const {translate} = useTranslate();
  const abilities = useAbility(AbilityContext);
  const router = useRouter();

  function renderIncludeButton() {
    if (props.hideIncludeButton) return <></>;
    return (
      <Button
        type="submit"
        variant="contained"
        onClick={
          props.customInclude
            ? () => props.customInclude && props.customInclude()
            : () => router.push(props.includeRoute ?? `${router.pathname}/create`)
        }
      >
        {translate('components.buttons.include')}
      </Button>
    );
  }

  return (
    <Card>
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
        <CardHeader title={translate(props.title ?? '')} />
        {props.renderAfterTitle && props.renderAfterTitle()}
        <Box sx={{...flexGenerator('r.center.flex-end')}}>
          {props.renderBeforeInclude && props.renderBeforeInclude()}
          {props.includePermission ? (
            <Can I={'create'} a={props.includePermission} ability={abilities}>
              {renderIncludeButton()}
            </Can>
          ) : (
            renderIncludeButton()
          )}
        </Box>
      </Box>
      <CardContent>
        {props.renderBelowTitle && props.renderBelowTitle()}
        <AutoFetchTable
          columns={props.tableConfig}
          route={props.route}
          extraParams={props.extraParams}
          selectedRows={props.selectedRows}
          setSelectedRows={props.setSelectedRows}
          renderAfterSearch={props.renderAfterSearch}
          mirrorDataToState={props.mirrorDataToState}
          renderOpositeToSpeedDial={props.renderOpositeToSpeedDial}
          hideSearch={props.hideSearch}
          ignoreSearch={props.ignoreSearch}
          setIgnoreSearch={props.setIgnoreSearch}
        />
      </CardContent>
    </Card>
  );
}
