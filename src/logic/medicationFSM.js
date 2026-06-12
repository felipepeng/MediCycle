// Máquina de Estados Finitos (FSM) do MediCycle.
//
// É a aplicação prática da Teoria da Computação (autômato finito determinístico)
// ao controle de validade dos medicamentos. A função de transição `getEstado`
// é pura e determinística: para a mesma entrada (data de validade) sempre
// produz o mesmo estado.

export const ESTADOS = {
  DISPONIVEL: 'DISPONIVEL',
  PROXIMO_VENCIMENTO: 'PROXIMO_VENCIMENTO',
  VENCIDO: 'VENCIDO',
};

// Janela (em dias) para considerar um medicamento "próximo ao vencimento".
export const DIAS_PROXIMO_VENCIMENTO = 30;

// Rótulos legíveis para a interface.
export const ROTULOS_ESTADO = {
  [ESTADOS.DISPONIVEL]: 'Disponível',
  [ESTADOS.PROXIMO_VENCIMENTO]: 'Próximo ao Vencimento',
  [ESTADOS.VENCIDO]: 'Vencido',
};

// Tabela de transição (documentação da FSM): condição de entrada -> estado.
export const TABELA_TRANSICAO = [
  { condicao: 'dias > 30', estado: ESTADOS.DISPONIVEL },
  { condicao: '0 <= dias <= 30', estado: ESTADOS.PROXIMO_VENCIMENTO },
  { condicao: 'dias < 0', estado: ESTADOS.VENCIDO },
];

// Diferença em dias inteiros entre a validade e "hoje" (ignorando horário).
function diferencaEmDias(dataValidade, hoje) {
  const MS_POR_DIA = 1000 * 60 * 60 * 24;
  const a = new Date(
    dataValidade.getFullYear(),
    dataValidade.getMonth(),
    dataValidade.getDate()
  );
  const b = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((a - b) / MS_POR_DIA);
}

// Função de transição da FSM: determina o estado a partir da data de validade.
export function getEstado(dataValidade, hoje = new Date()) {
  const dias = diferencaEmDias(dataValidade, hoje);
  if (dias < 0) return ESTADOS.VENCIDO;
  if (dias <= DIAS_PROXIMO_VENCIMENTO) return ESTADOS.PROXIMO_VENCIMENTO;
  return ESTADOS.DISPONIVEL;
}

// Regra de segurança: bloqueia o uso de medicamentos vencidos.
export function podeUsar(estado) {
  return estado !== ESTADOS.VENCIDO;
}

// Dias restantes até o vencimento (negativo se já vencido).
export function diasRestantes(dataValidade, hoje = new Date()) {
  return diferencaEmDias(dataValidade, hoje);
}
