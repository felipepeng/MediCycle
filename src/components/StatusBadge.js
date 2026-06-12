import { View, Text, StyleSheet } from 'react-native';
import { ESTADOS, ROTULOS_ESTADO } from '../logic/medicationFSM';
import { COLORS } from '../theme/colors';

// Cor de fundo do selo conforme o estado da FSM.
const CORES = {
  [ESTADOS.DISPONIVEL]: COLORS.disponivel,
  [ESTADOS.PROXIMO_VENCIMENTO]: COLORS.proximoVencimento,
  [ESTADOS.VENCIDO]: COLORS.vencido,
};

export default function StatusBadge({ estado }) {
  const cor = CORES[estado] || COLORS.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: cor }]}>
      <Text style={styles.texto}>{ROTULOS_ESTADO[estado] || 'Desconhecido'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  texto: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
