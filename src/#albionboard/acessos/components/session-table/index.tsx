import {FormCard} from 'src/@prismafive/components/cards/form-card';
import {DefaultTable} from 'src/@prismafive/components/tables/default-table';
import {useAcessosSessionsTableConfig} from './config';
import {SessionTableProps} from './types';

export function SessionTable(props: SessionTableProps) {
  const config = useAcessosSessionsTableConfig({init: props.init});
  return (
    <FormCard title="global.sessions" hideReturnButton>
      <DefaultTable tableName="acessos_sessions" data={props.sessions} columnDefinition={config.generateConfig()} />
    </FormCard>
  );
}
