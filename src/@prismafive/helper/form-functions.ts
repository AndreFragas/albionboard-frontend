import moment from 'moment';
import {cleanFormatDecimal, cleanFormatMoney, formatInfinityDecimal, formatMoney} from './formatters';

export function onlyDirtFields<T = Record<string, any>>(
  dirtyFields: Record<string, any>,
  data: Record<string, any>,
  ignore?: string[]
) {
  if (!data) return {} as T;
  const dirtyFieldStrings = Object.keys(dirtyFields);
  const dataValues = Object.keys(data);
  let newData: Record<string, any> = {};

  dataValues.forEach((value: string) => {
    if (value === 'id' || dirtyFieldStrings.includes(value) || ignore?.includes(value)) {
      newData = {...newData, [value]: data[value]};
    }
  });

  return newData as T;
}

export function swapObjectsToId<T = Record<string, any>>(data: Record<string, any>, toSwap: string[]) {
  if (!data) return {} as T;
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (toSwap.includes(element)) {
      if (data[element]) {
        data[`${element}_id`] = data[element].id;
        delete data[element];
      } else {
        if (data[element] === null) {
          data[`${element}_id`] = null;
        }
        delete data[element];
      }
    }
  });

  return data as T;
}

export function swapMultipleObjectsToIds(data: Record<string, any>, toSwap: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (toSwap.includes(element)) {
      if (data[element]) {
        data[element] = data[element].map((element: any) => element.id);
      } else {
        delete data[element];
      }
    }
  });

  return data;
}

export function swapOptionObjectToValue(data: Record<string, any>, toSwap: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (toSwap.includes(element)) {
      if (data[element]) {
        data[element] = data[element].value;
      } else {
        delete data[element];
      }
    }
  });

  return data;
}

export function deleteFields<T = any>(data: Record<string, any>, toDelete: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (toDelete.includes(element)) {
      delete data[element];
    }
  });

  return data as T;
}

export function castNumbersToString(data: Record<string, any>, fieldsToCast: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (fieldsToCast.includes(element)) {
      if (typeof data[element] === 'number') {
        data[element] = data[element].toString();
      }
    }
  });

  return data;
}

export function castStringsToNumber(data: Record<string, any>, fieldsToCast: string[], integer: boolean = false) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (fieldsToCast.includes(element)) {
      if (typeof data[element] === 'string') {
        if (integer) {
          data[element] = parseInt(data[element]);
        } else {
          data[element] = parseFloat(data[element]);
        }
        if (Number.isNaN(data[element])) {
          data[element] = 0;
        }
      }
    }
  });

  return data;
}

export function castToMoney(data: Record<string, any>, fieldsToCast: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (fieldsToCast.includes(element)) {
      data[element] = formatMoney(data[element]);
    }
  });

  return data;
}

export function castToDecimal(data: Record<string, any>, fieldsToCast: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (fieldsToCast.includes(element)) {
      data[element] = formatInfinityDecimal(data[element]);
    }
  });

  return data;
}

export function normalizeDates(data: Record<string, any>, fieldsToNormalize: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (fieldsToNormalize.includes(element)) {
      if (data[element] === '' || !data[element]) {
        data[element] = null;
      } else {
        data[element] = moment(data[element]).format('YYYY-MM-DD');
      }
    }
  });

  return data;
}

export function cleanEmptyStrings<T = Record<string, any>>(data: Record<string, any>) {
  if (!data) return {} as T;
  const keys = Object.keys(data);
  keys.forEach((element) => {
    if (data[element] === '') delete data[element];
  });
  return data as T;
}

export function cleanMultipleFormatMoneys(data: Record<string, any>, fieldsToClean: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (fieldsToClean.includes(element)) {
      data[element] = cleanFormatMoney(data[element]);
    }
  });

  return data;
}

export function cleanMultipleFormatDecimals(data: Record<string, any>, fieldsToClean: string[]) {
  if (!data) return {};
  const entries = Object.keys(data);
  entries.forEach((element) => {
    if (fieldsToClean.includes(element)) {
      data[element] = cleanFormatDecimal(data[element]);
    }
  });

  return data;
}
