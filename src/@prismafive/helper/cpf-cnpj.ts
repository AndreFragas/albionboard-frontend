export function isValidCNPJ(cnpj?: string | null, nullable?: boolean) {
  if (nullable && !cnpj) return true;
  if (!cnpj) return false;

  // Remover caracteres não numéricos do CNPJ
  cnpj = cnpj.replace(/[^\d]+/g, '');

  // CNPJs com todos os números iguais são inválidos
  if (cnpj.match(/^(\d)\1+$/)) {
    return false;
  }

  // Validar o primeiro dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (parseInt(cnpj.charAt(12)) !== digito) {
    return false;
  }

  // Validar o segundo dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  digito = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (parseInt(cnpj.charAt(13)) !== digito) {
    return false;
  }

  // CNPJ é válido
  return true;
}

export function isValidCPF(cpf?: string | null, nullable?: boolean) {
  if (nullable && !cpf) return true;
  if (!cpf) return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf == '') return false;

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // Verifica o primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;

  if (resto == 10 || resto == 11) {
    resto = 0;
  }

  if (resto != parseInt(cpf.substring(9, 10))) {
    return false;
  }

  soma = 0;

  // Verifica o segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;

  if (resto == 10 || resto == 11) {
    resto = 0;
  }

  if (resto != parseInt(cpf.substring(10, 11))) {
    return false;
  }

  return true;
}
