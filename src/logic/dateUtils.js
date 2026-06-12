// Conversões entre data no formato brasileiro (DD/MM/AAAA) e objeto Date.

// Converte "DD/MM/AAAA" em Date. Retorna null se o texto for inválido
// ou se a data não existir no calendário (ex.: 31/02/2026).
export function parseDataBR(texto) {
  if (typeof texto !== 'string') return null;
  const match = texto.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const dia = Number(match[1]);
  const mes = Number(match[2]);
  const ano = Number(match[3]);
  const data = new Date(ano, mes - 1, dia);

  // Garante que a data informada realmente existe.
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return null;
  }
  return data;
}

// Converte um objeto Date em "DD/MM/AAAA".
export function formatarDataBR(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}
