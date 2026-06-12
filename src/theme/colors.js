// Paleta de cores do MediCycle.
// As três últimas cores representam os estados da Máquina de Estados Finitos (FSM).
export const COLORS = {
  primary: '#2E7D5B', // verde MediCycle
  primaryDark: '#1B5E3F',
  background: '#F5F7F6',
  card: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#6B7280',
  border: '#E2E8E5',
  white: '#FFFFFF',

  // Cores por estado da FSM
  disponivel: '#2E7D32', // verde  -> Disponível
  proximoVencimento: '#F9A825', // âmbar -> Próximo ao Vencimento
  vencido: '#C62828', // vermelho -> Vencido
};
