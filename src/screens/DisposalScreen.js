import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { PONTOS_DE_COLETA } from '../data/collectionPoints';
import { avisar } from '../logic/dialogo';
import { COLORS } from '../theme/colors';

export default function DisposalScreen() {
  function abrirNoMapa(ponto) {
    const url = `https://www.google.com/maps/search/?api=1&query=${ponto.latitude},${ponto.longitude}`;
    Linking.openURL(url).catch(() =>
      avisar('Erro', 'Não foi possível abrir o mapa neste dispositivo.')
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.intro}>
        Leve medicamentos vencidos a um ponto de logística reversa. Nunca descarte no lixo
        comum, na pia ou no vaso sanitário.
      </Text>

      <FlatList
        contentContainerStyle={styles.lista}
        data={PONTOS_DE_COLETA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.endereco}>{item.endereco}</Text>
            <TouchableOpacity style={styles.botao} onPress={() => abrirNoMapa(item)}>
              <Text style={styles.botaoTexto}>Abrir no Google Maps</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  intro: {
    padding: 16,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  endereco: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
