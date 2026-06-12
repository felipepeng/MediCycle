// Persistência local do inventário usando AsyncStorage.
// Cada medicamento tem a forma:
//   { id, nome, registroAnvisa, dataValidade, foto }
//   - dataValidade em "DD/MM/AAAA"
//   - foto: data URI ("data:image/jpeg;base64,...") ou null quando não houver.

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@medicycle:medicamentos';

export async function listarMedicamentos() {
  try {
    const json = await AsyncStorage.getItem(CHAVE);
    return json ? JSON.parse(json) : [];
  } catch (erro) {
    console.warn('Erro ao listar medicamentos', erro);
    return [];
  }
}

async function persistir(lista) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
}

export async function salvarMedicamento(medicamento) {
  const lista = await listarMedicamentos();
  const novo = { id: String(Date.now()), ...medicamento };
  await persistir([novo, ...lista]);
  return novo;
}

export async function removerMedicamento(id) {
  const lista = await listarMedicamentos();
  await persistir(lista.filter((m) => m.id !== id));
}

export async function atualizarMedicamento(medicamento) {
  const lista = await listarMedicamentos();
  await persistir(lista.map((m) => (m.id === medicamento.id ? medicamento : m)));
}
