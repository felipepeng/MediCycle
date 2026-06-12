// Validação do registro da ANVISA por Expressão Regular (Regex).
//
// O registro do Ministério da Saúde (MS) possui 13 dígitos, normalmente
// exibido na embalagem no formato X.XXXX.XXXX.XXX-X.

const REGEX_FORMATADO = /^\d\.\d{4}\.\d{4}\.\d{3}-\d$/; // ex.: 1.0235.0456.001-9
const REGEX_DIGITOS = /^\d{13}$/; // ex.: 1023504560019

// Retorna true se `valor` seguir o padrão formatado OU tiver exatamente
// 13 dígitos (ignorando pontos e hífen).
export function validarRegistroAnvisa(valor) {
  if (typeof valor !== 'string') return false;
  const limpo = valor.trim();
  const somenteDigitos = limpo.replace(/\D/g, '');
  return REGEX_FORMATADO.test(limpo) || REGEX_DIGITOS.test(somenteDigitos);
}
