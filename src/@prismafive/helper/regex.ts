export const onlyNumbers = `^[0-9]*$`;

export const onlyIntegerNumbers = `^[0-9.]*$`;

export const maskCnpj = `/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$`;

export const validEmailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function hasOnlyNumbers(value: string) {
  if (!value) return true;
  const regex = new RegExp(onlyNumbers);
  return regex.test(value);
}
