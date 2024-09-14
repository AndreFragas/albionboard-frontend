import {ISession} from '../../types';

export interface SessionTableProps {
  sessions: ISession[];
  init: () => void;
}
