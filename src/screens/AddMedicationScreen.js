import { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { reconhecerEmbalagem } from '../logic/simulatedOCR';
import { validarRegistroAnvisa } from '../logic/anvisaValidator';
import { parseDataBR } from '../logic/dateUtils';
import {
  salvarMedicamento,
  atualizarMedicamento,
} from '../storage/medicationStorage';
import { avisar } from '../logic/dialogo';
import { COLORS } from '../theme/colors';

// Esta mesma tela funciona para ADICIONAR e para EDITAR.
// O modo de edição é ativado quando o Inventário navega para cá passando
// `route.params.medicamento`.
export default function AddMedicationScreen({ navigation, route }) {
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState('');
  const [registro, setRegistro] = useState('');
  const [validade, setValidade] = useState('');
  const [foto, setFoto] = useState(null);
  const [processando, setProcessando] = useState(false);

  // Sincroniza o formulário com os parâmetros de navegação ao focar a tela:
  // - com `medicamento` => modo edição (campos preenchidos);
  // - sem `medicamento` => modo adição (campos vazios).
  // Ao sair da tela, limpamos o parâmetro para não "vazar" uma edição antiga
  // para o próximo uso da aba Adicionar.
  useFocusEffect(
    useCallback(() => {
      const med = route.params?.medicamento;
      setEditandoId(med?.id ?? null);
      setNome(med?.nome ?? '');
      setRegistro(med?.registroAnvisa ?? '');
      setValidade(med?.dataValidade ?? '');
      setFoto(med?.foto ?? null);

      return () => {
        if (route.params?.medicamento) {
          navigation.setParams({ medicamento: undefined });
        }
      };
    }, [route.params?.medicamento, navigation])
  );

  function limparFormulario() {
    setEditandoId(null);
    setNome('');
    setRegistro('');
    setValidade('');
    setFoto(null);
  }

  // Abre a câmera (nativo) ou o seletor de arquivos (web/galeria) e devolve a
  // imagem já como data URI persistível (base64). Retorna null se cancelado.
  async function escolherImagem() {
    const opcoes = { mediaTypes: ['images'], quality: 0.4, base64: true };
    let resultado;

    if (Platform.OS === 'web') {
      resultado = await ImagePicker.launchImageLibraryAsync(opcoes);
    } else {
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      if (camera.granted) {
        resultado = await ImagePicker.launchCameraAsync(opcoes);
      } else {
        // Sem câmera: tenta a galeria como alternativa.
        const galeria = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!galeria.granted) {
          avisar(
            'Permissão necessária',
            'Permita o acesso à câmera ou à galeria para adicionar a foto.'
          );
          return null;
        }
        resultado = await ImagePicker.launchImageLibraryAsync(opcoes);
      }
    }

    if (resultado.canceled) return null;
    const asset = resultado.assets[0];
    // Preferimos o data URI (base64): persiste no AsyncStorage e funciona tanto
    // na web (onde blob: URLs morrem ao recarregar) quanto no nativo.
    return asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
  }

  // Apenas seleciona/troca a foto da embalagem (não mexe nos campos).
  async function selecionarFoto() {
    const uri = await escolherImagem();
    if (uri) setFoto(uri);
  }

  // OCR simulado: usa a foto já escolhida (ou pede uma) e preenche os campos.
  async function preencherPorOCR() {
    let uri = foto;
    if (!uri) {
      uri = await escolherImagem();
      if (!uri) return;
      setFoto(uri);
    }

    setProcessando(true);
    try {
      const dados = await reconhecerEmbalagem(uri);
      setNome(dados.nome);
      setRegistro(dados.registroAnvisa);
      setValidade(dados.dataValidade);
      avisar('Leitura concluída', 'Os dados foram preenchidos. Revise antes de salvar.');
    } finally {
      setProcessando(false);
    }
  }

  async function salvar() {
    if (!nome.trim()) {
      avisar('Dados incompletos', 'Informe o nome do medicamento.');
      return;
    }
    if (!validarRegistroAnvisa(registro)) {
      avisar(
        'Registro inválido',
        'O registro da ANVISA deve seguir o padrão X.XXXX.XXXX.XXX-X (13 dígitos).'
      );
      return;
    }
    if (!parseDataBR(validade)) {
      avisar('Data inválida', 'Informe a validade no formato DD/MM/AAAA.');
      return;
    }

    const dados = {
      nome: nome.trim(),
      registroAnvisa: registro.trim(),
      dataValidade: validade.trim(),
      foto: foto ?? null,
    };

    if (editandoId) {
      await atualizarMedicamento({ id: editandoId, ...dados });
      avisar('Atualizado', 'As alterações foram salvas.');
    } else {
      await salvarMedicamento(dados);
      avisar('Salvo', 'Medicamento adicionado ao inventário.');
    }

    limparFormulario();
    navigation.navigate('Inventário');
  }

  const editando = editandoId != null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      {editando && (
        <View style={styles.faixaEdicao}>
          <Text style={styles.faixaEdicaoTexto}>✏️  Editando medicamento</Text>
        </View>
      )}

      {/* Foto da embalagem: pré-visualização + seleção */}
      <TouchableOpacity
        style={styles.areaFoto}
        onPress={selecionarFoto}
        disabled={processando}
        activeOpacity={0.8}
      >
        {foto ? (
          <Image source={{ uri: foto }} style={styles.foto} resizeMode="contain" />
        ) : (
          <View style={styles.fotoPlaceholder}>
            <Text style={styles.fotoPlaceholderEmoji}>📷</Text>
            <Text style={styles.fotoPlaceholderTexto}>
              Toque para adicionar a foto da embalagem
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {foto && (
        <View style={styles.linhaFotoAcoes}>
          <TouchableOpacity onPress={selecionarFoto} disabled={processando}>
            <Text style={styles.linkAcao}>Trocar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFoto(null)} disabled={processando}>
            <Text style={[styles.linkAcao, styles.linkRemover]}>Remover foto</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.botaoOCR}
        onPress={preencherPorOCR}
        disabled={processando}
      >
        <Text style={styles.botaoOCRTexto}>✨  Preencher por OCR</Text>
      </TouchableOpacity>

      {processando && (
        <View style={styles.processando}>
          <ActivityIndicator color={COLORS.primary} />
          <Text style={styles.processandoTexto}>Reconhecendo embalagem (OCR simulado)…</Text>
        </View>
      )}

      <Text style={styles.rotulo}>Nome do medicamento</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex.: Dipirona 500mg"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={styles.rotulo}>Registro ANVISA</Text>
      <TextInput
        style={styles.input}
        value={registro}
        onChangeText={setRegistro}
        placeholder="X.XXXX.XXXX.XXX-X"
        placeholderTextColor={COLORS.textMuted}
        autoCapitalize="none"
      />

      <Text style={styles.rotulo}>Validade (DD/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        value={validade}
        onChangeText={setValidade}
        placeholder="31/12/2026"
        placeholderTextColor={COLORS.textMuted}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvar} disabled={processando}>
        <Text style={styles.botaoSalvarTexto}>
          {editando ? 'Salvar alterações' : 'Salvar no inventário'}
        </Text>
      </TouchableOpacity>

      {editando && (
        <TouchableOpacity
          style={styles.botaoCancelar}
          onPress={() => {
            limparFormulario();
            navigation.navigate('Inventário');
          }}
        >
          <Text style={styles.botaoCancelarTexto}>Cancelar edição</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  conteudo: {
    padding: 16,
  },
  faixaEdicao: {
    backgroundColor: COLORS.proximoVencimento,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  faixaEdicaoTexto: {
    color: COLORS.white,
    fontWeight: '700',
  },
  areaFoto: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  fotoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fotoPlaceholderEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  fotoPlaceholderTexto: {
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  linhaFotoAcoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  linkAcao: {
    color: COLORS.primary,
    fontWeight: '600',
    paddingVertical: 4,
  },
  linkRemover: {
    color: COLORS.vencido,
  },
  botaoOCR: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoOCRTexto: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
  },
  processando: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  processandoTexto: {
    marginLeft: 8,
    color: COLORS.textMuted,
  },
  rotulo: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  botaoSalvar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  botaoSalvarTexto: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
  botaoCancelar: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoCancelarTexto: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 15,
  },
});
