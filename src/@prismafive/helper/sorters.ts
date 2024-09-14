import moment from 'moment';
import {cleanFormatInfinityDecimal, cleanFormatMoney} from './formatters';

export const sortCurrencyCell = (a: string, b: string) => (cleanFormatMoney(a) < cleanFormatMoney(b) ? -1 : 1);

export const sortDateCell = (a: string, b: string) =>
  parseInt(moment(a).format('YYYYMMDD')) < parseInt(moment(b).format('YYYYMMDD')) ? -1 : 1;

export const sortDecimalCell = (a: string, b: string) =>
  parseFloat(cleanFormatInfinityDecimal(a)) < parseFloat(cleanFormatInfinityDecimal(b)) ? -1 : 1;
