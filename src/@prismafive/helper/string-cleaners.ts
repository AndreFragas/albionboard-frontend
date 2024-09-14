export function removeAccent(str: string): string {
  if (!str) return '';
  const mapaAcentos: {[key: string]: RegExp} = {
    a: /[àáâãäå]/g,
    e: /[èéêë]/g,
    i: /[ìíîï]/g,
    o: /[òóôõö]/g,
    u: /[ùúûü]/g,
    c: /[ç]/g,
    n: /[ñ]/g,
  };

  for (let letra in mapaAcentos) {
    str = str.replace(mapaAcentos[letra], letra);
  }

  return str;
}
