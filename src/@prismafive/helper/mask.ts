export function maskCep(cep: string) {
  if (!cep) return '';

  cep = cep.replace(/\D/g, ''); // Remove tudo que não for número
  cep = cep.replace(/(\d{5})(\d{1,3})?/, '$1-$2'); // Adiciona hífen após os primeiros 5 dígitos
  return cep;
}

export function maskCnpj(cnpj?: string) {
  if (!cnpj) return '';
  cnpj = cnpj.replace(/\D/g, ''); // Remove tudo que não for número
  cnpj = cnpj.replace(/(\d{2})(\d)/, '$1.$2'); // Adiciona ponto após o 2º dígito
  cnpj = cnpj.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após o 5º dígito
  cnpj = cnpj.replace(/(\d{3})(\d)/, '$1/$2'); // Adiciona barra após o 8º dígito
  cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2'); // Adiciona hífen antes dos últimos 4 dígitos
  return cnpj;
}

export function deMaskCnpj(cnpj: string) {
  if (!cnpj) return '';
  return cnpj.replaceAll('.', '').replaceAll('-', '').replaceAll('/', '');
}

export function deMaskCpf(cpf: string) {
  if (!cpf) return '';
  return cpf.replaceAll('.', '').replaceAll('-', '');
}

export function clearAllMasks(value: string) {
  if (!value) return '';
  return value
    .replaceAll('.', '')
    .replaceAll('-', '')
    .replaceAll('/', '')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll(' ', '')
    .replaceAll('_', '');
}

export function maskCpf(cpf?: string) {
  if (!cpf) return '';
  cpf = cpf.replace(/\D/g, ''); // Remove tudo que não for número
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após o 3º dígito
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após o 6º dígito
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos últimos 2 dígitos
  return cpf;
}

export function maskIe(ie: string) {
  if (!ie) return '';

  if (ie.charAt(0).toUpperCase() == 'P') {
    return ie;
  }

  ie = ie.replace(/\D/g, ''); // Remove tudo que não for número
  ie = ie.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após o 3º dígito
  ie = ie.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após o 6º dígito
  ie = ie.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos últimos 2 dígitos
  return ie;
}

export function MaskIm(im: string) {
  im = im.replace(/\D/g, ''); // Remove tudo que não for número
  im = im.replace(/(\d{1,3})(\d{1,3})(\d{1,4})/, '$1/$2-$3'); // Adiciona barras e hífen nos lugares corretos
  return im;
}

export function maskTelefone(value?: string) {
  if (!value) return '';
  if (value.length > 15) return value.substring(0, 15);

  if (typeof value != 'string') return '';

  const digits = value.replace(/\D/g, '');

  const match = digits.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
  if (!match) return '';
  return match[1]
    ? `(${match[1]}` +
        (match[2] ? `) ${match[2]}` + (match[3] ? `-${match[3]}` : '') : '')
    : '';
}

export function clearMaskTelefone(value?: string) {
  if (!value) return '';

  return value.replace(/[\(\)\.\s-]+/g, '');
}

export function maskCpfCnpj(v: string) {
  v = v.replace(/\D/g, "");

  if (v.length <= 11) { // CPF
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else { // CNPJ
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  }

  return v;
};