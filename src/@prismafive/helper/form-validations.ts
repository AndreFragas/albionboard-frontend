import {isValidCNPJ, isValidCPF} from './cpf-cnpj';

export type TValidate = [(value: any, form: any) => any, string | any];

const removeSpace = (value: string): string => value?.replace(/\s/, '') || '';

export const isEmpty = (message?: string): TValidate => [
  (value: any) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') {
      return !removeSpace(value).length;
    } else if (typeof value === 'object') {
      if (Object.keys(value).length === 0) return true;
    } else if (Array.isArray(value)) {
      if (value.length === 0) return true;
    }
    return false;
  },
  message || 'components.formField.errors.isEmpty',
];

export const maxLength = (size: number, message?: string): TValidate => [
  (value: any) => {
    if (value === null) return false;
    if (typeof value === 'string') {
      if (value.length <= size) return false;
    }
    return true;
  },
  message || {
    key: 'components.formField.errors.maxLength',
    options: {size: size},
  },
];

export const isEmail = (message?: string): TValidate => [
  (value) => !`${value}`.match(/^[a-z0-9._-]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)?.length,
  message || 'components.formField.errors.invalidEmail',
];

export const isNumberAboveZero = (message?: string, nullable?: boolean): TValidate => [
  (value) => {
    if (nullable && !value) return false;
    if (value <= 0 || value === undefined || value === null) return true;
    return false;
  },
  message || 'components.formField.errors.invalidNumber',
];

export const isCnpjValid = (message?: string, nullable?: boolean): TValidate => [
  (value) => {
    return !isValidCNPJ(value, nullable);
  },
  message || 'components.formField.errors.invalidCnpj',
];

export const isCpfValid = (message?: string, nullable?: boolean): TValidate => [
  (value) => {
    if (typeof value === 'string') {
      const trimed = value.trim();
      if (trimed.length === 0 && nullable) return false;
    }
    if (nullable && !value) return false;
    return !isValidCPF(value, nullable);
  },
  message || 'components.formField.errors.invalidCpf',
];
