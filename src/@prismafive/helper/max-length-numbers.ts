export function maxLengthNumber(maxDecimal: number, length: number, value: number) {
  if (maxDecimal > 0) {
    const partes = value.toString().split('.');
    const parteInteira = partes[0];
    const parteDecimal = partes[1] || '';

    if (parteInteira.length > length) {
      const novaParteInteira = parteInteira.slice(0, length);
      value = parseFloat(`${novaParteInteira}.${parteDecimal}`);
    }

    if (parteDecimal.length > maxDecimal) {
      const novaParteDecimal = parteDecimal.slice(0, maxDecimal);
      value = parseFloat(`${parteInteira}.${novaParteDecimal}`);
    }
  } else {
    if (value.toString().length > length) {
      var numeroTruncado = value.toString().slice(0, length);
      value = parseInt(numeroTruncado);
    }
  }

  return value;
}
