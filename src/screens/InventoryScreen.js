import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarMedicamentos, removerMedicamento } from '../storage/medicationStorage';
import { getEstado, podeUsar, diasRestantes } from '../logic/medicationFSM';
import { parseDataBR } from '../logic/dateUtils';
import { avisar, confirmar } from '../logic/dialogo';
import MedicationCard from '../components/MedicationCard';
import { COLORS } from '../theme/colors';

export default function InventoryScreen({ navigation }) {
  const [medicamentos, setMedicamentos] = useState([]);

  const carregar = useCallback(async () => {
    setMedicamentos(await listarMedicamentos());
  }, []);

  // Recarrega sempre que a aba ganha foco (ex.: após salvar um novo item).
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  // Calcula o estado e os dias restantes de cada item pela FSM.
  function calcular(medicamento) {
    const data = parseDataBR(medicamento.dataValidade);
    return {
      estado: data ? getEstado(data) : undefined,
      dias: data ? diasRestantes(data) : 0,
    };
  }

  function aoUsar(medicamento, estado) {
    if (!podeUsar(estado)) {
      avisar(
        'Uso bloqueado',
        `"${medicamento.nome}" está VENCIDO. O uso foi bloqueado por segurança. Leve-o a um ponto de descarte.`
      );
      return;
    }
    avisar('Uso registrado', `Você registrou o uso de "${medicamento.nome}".`);
  }

  function aoEditar(medicamento) {
    navigation.navigate('Adicionar', { medicamento });
  }

  function aoRemover(medicamento) {
    confirmar({
      titulo: 'Remover',
      mensagem: `Remover "${medicamento.nome}" do inventário?`,
      textoConfirmar: 'Remover',
      destrutivo: true,
      onConfirmar: async () => {
        await removerMedicamento(medicamento.id);
        carregar();
      },
    });
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.lista}
        data={medicamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { estado, dias } = calcular(item);
          return (
            <MedicationCard
              medicamento={item}
              estado={estado}
              diasRestantes={dias}
              onUsar={() => aoUsar(item, estado)}
              onEditar={() => aoEditar(item)}
              onRemover={() => aoRemover(item)}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            Nenhum medicamento cadastrado.{'\n'}Toque em "+ Adicionar" para começar.
          </Text>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Adicionar')}>
        <Text style={styles.fabTexto}>+ Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  lista: {
    padding: 16,
    paddingBottom: 90,
    flexGrow: 1,
    // Na web a lista ocuparia a tela inteira; limitamos a largura e
    // centralizamos a coluna de cards para não ficar "esticada".
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  vazio: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 48,
    fontSize: 15,
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabTexto: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
