import {ReactElement} from 'react';

export interface GenericTableActionsProps {
  api: Record<string, any>;
  route: string;
  permission: string;
  extraActions?: ((id: number) => ReactElement)[];
  excludeActions?: string[];
}
