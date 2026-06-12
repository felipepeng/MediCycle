# Plano — Protótipo MediCycle

## Contexto

O **MediCycle** é um app móvel cujo objetivo é ajudar o cidadão a fazer o
inventário da farmácia caseira, monitorar validades e descartar medicamentos
corretamente (logística reversa). A documentação define quatro pilares técnicos:
inventário por **foto/OCR**, validação do registro **ANVISA via Regex**, uma
**Máquina de Estados Finitos (FSM)** que classifica cada medicamento em
`Disponível` / `Próximo ao Vencimento` / `Vencido` (e bloqueia uso indevido), e
a **localização de pontos de coleta**.

A pasta do projeto está **vazia** — é um build do zero. O objetivo deste plano é
entregar o **protótipo mais simples possível, porém funcional**, rodável no
celular via **Expo Go** (sem Android Studio/Xcode), sem backend, sem login e
**sem interação com git**. Ao final, gerar um `README.md`.

Decisões de escopo confirmadas (caminho mais enxuto):
- **OCR simulado** — captura a foto e preenche os campos com dados de exemplo
  para o usuário confirmar/editar (sem API externa).
- **Pontos de coleta**: lista fixa + botão "Abrir no Google Maps".
- **Alertas**: apenas **status visual** (badges coloridos dirigidos pela FSM),
  sem notificações agendadas.

## Stack e princípios

- **Expo (managed workflow)** + React Native, JavaScript (sem TypeScript para
  simplificar). Roda via `npx expo start` + app **Expo Go**.
- Persistência local com **AsyncStorage** (sem backend/login).
- Navegação por **abas inferiores** (`@react-navigation/bottom-tabs`) — 3 telas.
- Foto via **expo-image-picker** (`launchCameraAsync` / galeria).
- Abertura do mapa via **Linking** (nativo do React Native, sem dependência extra).
- Código em **português** (UI e nomes de domínio), comentários objetivos.

## Estrutura de arquivos a criar

```
Medycicle/
  package.json, app.json, babel.config.js   (scaffold Expo + deps)
  App.js                                     (registra navegação por abas)
  README.md                                  (documentação do projeto — em PT)
  src/
    logic/
      medicationFSM.js        # FSM: núcleo de Teoria da Computação
      anvisaValidator.js      # validação do registro ANVISA por Regex
      simulatedOCR.js         # "OCR" mockado a partir da foto
    storage/
      medicationStorage.js    # CRUD em AsyncStorage
    data/
      collectionPoints.js     # lista fixa de pontos de descarte
    components/
      StatusBadge.js          # selo colorido por estado da FSM
      MedicationCard.js       # item da lista de inventário
    screens/
      InventoryScreen.js      # lista + ação "usar" (bloqueio se vencido)
      AddMedicationScreen.js  # foto -> OCR simulado -> form -> validação -> salvar
      DisposalScreen.js       # pontos de coleta + "Abrir no Google Maps"
    theme/
      colors.js               # paleta (verde/amarelo/vermelho dos estados)
```

## Núcleo técnico (o que dá rigor acadêmico ao protótipo)

### 1. Máquina de Estados Finitos — `src/logic/medicationFSM.js`
Função pura e determinística (demonstração de autômato). Estados:
`DISPONIVEL`, `PROXIMO_VENCIMENTO`, `VENCIDO`.

- `getEstado(dataValidade, hoje = new Date())`:
  - `dias = diferençaEmDias(dataValidade, hoje)`
  - `dias < 0` → `VENCIDO`
  - `0 ≤ dias ≤ 30` (constante `DIAS_PROXIMO_VENCIMENTO = 30`) → `PROXIMO_VENCIMENTO`
  - `dias > 30` → `DISPONIVEL`
- `podeUsar(estado)`: retorna `false` se `VENCIDO` (bloqueio de uso indevido),
  `true` caso contrário.
- Exportar também a **tabela de transição** como objeto, para documentar no README.

### 2. Validação ANVISA — `src/logic/anvisaValidator.js`
Registro MS tem 13 dígitos, exibido como `X.XXXX.XXXX.XXX-X`.
- `validarRegistroAnvisa(valor)`: normaliza e testa contra
  `^\d\.\d{4}\.\d{4}\.\d{3}-\d$` (formatado) **ou** `^\d{13}$` (só dígitos).
- Usado no `AddMedicationScreen` para barrar salvamento com registro inválido.

### 3. OCR simulado — `src/logic/simulatedOCR.js`
- `reconhecerEmbalagem(uriDaFoto)`: simula o reconhecimento retornando um objeto
  `{ nome, registroAnvisa, dataValidade }` a partir de uma pequena lista de
  exemplos (rotaciona/aleatoriza). Pequeno `setTimeout` para simular o
  processamento. O usuário **revisa e edita** os campos antes de salvar.

### 4. Armazenamento — `src/storage/medicationStorage.js`
- `listarMedicamentos()`, `salvarMedicamento(med)`, `removerMedicamento(id)`,
  `atualizarMedicamento(med)` sobre uma chave única no AsyncStorage (array JSON).
- `id` simples via `Date.now()`.

### 5. Pontos de coleta — `src/data/collectionPoints.js`
- Array fixo com `{ nome, endereco, latitude, longitude }` (3–5 farmácias/UBS de
  exemplo). `DisposalScreen` abre
  `https://www.google.com/maps/search/?api=1&query=lat,lng` via `Linking.openURL`.

## Telas (UI mínima e funcional)

- **Inventário** (`InventoryScreen`): carrega do storage, calcula o estado de cada
  item pela FSM em tempo de render, mostra `MedicationCard` com `StatusBadge`
  colorido (verde/amarelo/vermelho), botão **Usar** (bloqueado com alerta se
  `VENCIDO`) e **Remover**. Botão "+" leva à tela de adicionar.
- **Adicionar** (`AddMedicationScreen`): botão **Tirar foto** → `simulatedOCR`
  preenche o form → campos editáveis (nome, registro ANVISA, validade
  `DD/MM/AAAA`) → ao salvar, valida ANVISA e data; se ok, grava e volta ao
  inventário.
- **Descarte** (`DisposalScreen`): lista os pontos fixos com endereço e botão
  **Abrir no Google Maps**.

## Dependências a instalar

```
expo (scaffold via: npx create-expo-app Medycicle --template blank)
@react-navigation/native @react-navigation/bottom-tabs
react-native-screens react-native-safe-area-context
@react-native-async-storage/async-storage
expo-image-picker
```
(`Linking` é nativo — não precisa instalar.)

## README.md (em português) — conteúdo

- Visão geral e propósito (ODS 3 / OMS / descarte correto de fármacos).
- Funcionalidades do protótipo.
- Stack tecnológica.
- **Como rodar**: `npm install` → `npx expo start` → abrir no **Expo Go**
  (QR code) ou emulador.
- Estrutura de pastas.
- Explicação da **FSM** (tabela de estados/transições) e da **validação ANVISA**.
- **Limitações do protótipo**: OCR simulado, dados locais (AsyncStorage), sem
  notificações agendadas, lista de pontos fixa.
- Contexto acadêmico (Teoria da Computação / autômatos).

## Verificação (como testar de ponta a ponta)

1. `npm install` e `npx expo start`; abrir no Expo Go (ou emulador Android).
2. Aba **Adicionar** → "Tirar foto" → conferir preenchimento automático (OCR
   simulado) → editar um campo → digitar registro ANVISA **inválido** e
   confirmar que o salvamento é **bloqueado**; corrigir e salvar.
3. Aba **Inventário** → confirmar o item com **badge colorido** correto. Testar
   os 3 estados cadastrando validades: futura distante (verde), dentro de 30
   dias (amarelo), já passada (vermelho).
4. Tocar **Usar** num item `Vencido` → confirmar **bloqueio com alerta**; tocar
   em um `Disponível` → confirmar que permite.
5. Reabrir o app → confirmar **persistência** (AsyncStorage).
6. Aba **Descarte** → tocar **Abrir no Google Maps** → confirmar abertura do mapa
   no ponto.

## Fora de escopo (deliberadamente, para manter simples)

OCR real/on-device, notificações push agendadas, mapa interativo embutido,
backend/login/sincronização, testes automatizados e qualquer operação de git.
