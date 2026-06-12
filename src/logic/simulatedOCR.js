// OCR SIMULADO.
//
// Em um aplicativo real, aqui entraria uma biblioteca de OCR (Optical Character
// Recognition) para ler nome, registro ANVISA e validade diretamente da foto da
// embalagem. Para manter o protótipo simples, retornamos dados de exemplo após
// um pequeno atraso que imita o "processamento". O usuário sempre revisa e edita
// os campos antes de salvar.

// Lista fixa de 5 exemplos percorrida em ordem (um por chamada).
// O campo `validadeDias` é o deslocamento em dias a partir de hoje — escolhido
// para que a lista exercite os três estados da FSM ao longo do ciclo.
const EXEMPLOS = [
  { nome: 'Dipirona Sódica 500mg', registroAnvisa: '1.0235.0456.001-9', validadeDias: 180 },
  { nome: 'Amoxicilina 500mg', registroAnvisa: '1.5678.1234.045-2', validadeDias: 15 },
  { nome: 'Paracetamol 750mg', registroAnvisa: '1.0089.0777.013-4', validadeDias: -5 },
  { nome: 'Ibuprofeno 400mg', registroAnvisa: '1.3344.0099.020-7', validadeDias: 365 },
  { nome: 'Omeprazol 20mg', registroAnvisa: '1.4521.0333.008-1', validadeDias: 30 },
];

// Índice do próximo exemplo a retornar (avança a cada leitura, em ciclo).
let proximoIndice = 0;

// Gera uma data de validade (DD/MM/AAAA) a partir de um deslocamento em dias.
function dataValidadeExemplo(deslocamentoDias) {
  const d = new Date();
  d.setDate(d.getDate() + deslocamentoDias);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

// Simula o reconhecimento da embalagem. Recebe a URI da foto (não usada no
// protótipo) e resolve com { nome, registroAnvisa, dataValidade }.
export function reconhecerEmbalagem(uriDaFoto) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Percorre a lista em ordem, um exemplo por chamada (volta ao início no fim).
      const exemplo = EXEMPLOS[proximoIndice];
      proximoIndice = (proximoIndice + 1) % EXEMPLOS.length;
      resolve({
        nome: exemplo.nome,
        registroAnvisa: exemplo.registroAnvisa,
        dataValidade: dataValidadeExemplo(exemplo.validadeDias),
      });
    }, 1200);
  });
}
