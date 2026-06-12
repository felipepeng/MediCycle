import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import StatusBadge from './StatusBadge';
import { COLORS } from '../theme/colors';

// Cartão de um medicamento na lista do inventário.
export default function MedicationCard({
  medicamento,
  estado,
  diasRestantes,
  onUsar,
  onEditar,
  onRemover,
}) {
  const textoDias =
    diasRestantes < 0
      ? `Vencido há ${Math.abs(diasRestantes)} dia(s)`
      : `Vence em ${diasRestantes} dia(s)`;

  return (
    <View style={styles.card}>
      {medicamento.foto ? (
        <Image source={{ uri: medicamento.foto }} style={styles.foto} resizeMode="contain" />
      ) : null}

      <View style={styles.cabecalho}>
        <Text style={styles.nome}>{medicamento.nome}</Text>
        <StatusBadge estado={estado} />
      </View>
      <Text style={styles.detalhe}>Registro ANVISA: {medicamento.registroAnvisa}</Text>
      <Text style={styles.detalhe}>Validade: {medicamento.dataValidade}</Text>
      <Text style={styles.dias}>{textoDias}</Text>

      <View style={styles.divisor} />

      <View style={styles.acoes}>
        <TouchableOpacity style={[styles.botao, styles.botaoUsar]} onPress={onUsar}>
          <Text style={styles.botaoTexto}>Usar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, styles.botaoEditar]} onPress={onEditar}>
          <Text style={styles.botaoTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, styles.botaoRemover]} onPress={onRemover}>
          <Text style={styles.botaoTexto}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    // Acabamento (sombra suave -> box-shadow na web).
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  foto: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: COLORS.background,
  },
  cabecalho: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  detalhe: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  dias: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  divisor: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: COLORS.border,
    marginTop: 16,
  },
  acoes: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 14,
  },
  botao: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  botaoUsar: {
    backgroundColor: COLORS.primary,
  },
  botaoEditar: {
    backgroundColor: COLORS.primaryDark,
  },
  botaoRemover: {
    backgroundColor: COLORS.vencido,
    marginRight: 0,
  },
  botaoTexto: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
