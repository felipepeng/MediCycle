// Diálogos cross-platform (aviso e confirmação).
//
// IMPORTANTE: no React Native Web o `Alert.alert` é um *no-op* — não exibe nada
// e nunca dispara os callbacks dos botões. Por isso, no navegador, usamos
// `window.alert` / `window.confirm`. No nativo (Android/iOS) usamos o Alert.
import { Alert, Platform } from 'react-native';

// Mensagem informativa de um único botão ("OK").
export function avisar(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    return;
  }
  Alert.alert(titulo, mensagem);
}

// Confirmação com ação (chama `onConfirmar` apenas se o usuário confirmar).
export function confirmar({
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  destrutivo = false,
  onConfirmar,
}) {
  if (Platform.OS === 'web') {
    const ok = window.confirm(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    if (ok) onConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: textoCancelar, style: 'cancel' },
    {
      text: textoConfirmar,
      style: destrutivo ? 'destructive' : 'default',
      onPress: onConfirmar,
    },
  ]);
}
