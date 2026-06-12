# MediCycle 💊♻️

Protótipo de aplicativo móvel para **inventário inteligente, controle de validade
e descarte correto de medicamentos**. O MediCycle ajuda o cidadão a organizar a
farmácia caseira, reduzindo o desperdício, o risco de intoxicações e o descarte
inadequado de resíduos químicos.

O projeto se alinha à **ODS 3 da ONU** (Saúde e Bem-Estar) e à definição de saúde
da **OMS**, conectando o usuário às políticas de logística reversa de fármacos.

> ⚠️ **Protótipo acadêmico.** Foi desenvolvido no caminho mais simples possível,
> apenas o suficiente para ser funcional e demonstrar o conceito.

---

## Funcionalidades

- 📷 **Cadastro por foto** com **OCR simulado**: tira a foto da embalagem e
  preenche automaticamente nome, registro ANVISA e validade (o usuário revisa e
  edita antes de salvar).
- ✅ **Validação do registro da ANVISA** por **Expressão Regular (Regex)**.
- 🔁 **Máquina de Estados Finitos (FSM)** que classifica cada medicamento em
  **Disponível**, **Próximo ao Vencimento** ou **Vencido**.
- 🟢🟡🔴 **Status visual** por cores e **bloqueio de uso** de itens vencidos.
- ♻️ **Pontos de coleta** (logística reversa) com link direto para o Google Maps.
- 💾 **Persistência local** no aparelho (sem servidor, sem login).

---

## Stack tecnológica

| Camada            | Tecnologia                                   |
| ----------------- | -------------------------------------------- |
| Framework         | **Expo** (React Native)                      |
| Linguagem         | JavaScript                                   |
| Navegação         | React Navigation (abas inferiores)           |
| Armazenamento     | AsyncStorage                                 |
| Câmera/Foto       | expo-image-picker                            |
| Lógica de domínio | FSM + Regex (JavaScript puro)                |

---

## Como rodar

Pré-requisitos: **Node.js** instalado e o app **Expo Go** no celular
(Android/iOS), ou um emulador Android.

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start
```

Em seguida:

- **No celular:** abra o app **Expo Go** e escaneie o **QR Code** exibido no
  terminal.
- **No emulador:** pressione `a` (Android) no terminal do Expo.

---

## Estrutura do projeto

```
Medycicle/
├── App.js                       # Navegação por abas (Inventário, Adicionar, Descarte)
├── app.json                     # Configuração do Expo
├── README.md
└── src/
    ├── logic/
    │   ├── medicationFSM.js      # Máquina de Estados Finitos (núcleo de Teoria da Computação)
    │   ├── anvisaValidator.js    # Validação do registro ANVISA por Regex
    │   ├── simulatedOCR.js       # OCR simulado
    │   └── dateUtils.js          # Conversão de datas DD/MM/AAAA
    ├── storage/
    │   └── medicationStorage.js  # CRUD em AsyncStorage
    ├── data/
    │   └── collectionPoints.js   # Pontos de coleta (fixos)
    ├── components/
    │   ├── StatusBadge.js        # Selo colorido por estado
    │   └── MedicationCard.js     # Item da lista de inventário
    ├── screens/
    │   ├── InventoryScreen.js    # Lista + ação "Usar" (com bloqueio)
    │   ├── AddMedicationScreen.js # Foto → OCR → formulário → validação
    │   └── DisposalScreen.js     # Pontos de coleta + abrir no mapa
    └── theme/
        └── colors.js             # Paleta de cores
```

---

## Máquina de Estados Finitos (FSM)

O coração do controle de validade é um **autômato finito determinístico**
(`src/logic/medicationFSM.js`). A função de transição é pura: para a mesma data
de validade, sempre produz o mesmo estado.

Seja `dias` o número de dias entre **hoje** e a **validade**:

| Condição de entrada      | Estado resultante         | Cor      |
| ------------------------ | ------------------------- | -------- |
| `dias > 30`              | **Disponível**            | 🟢 Verde |
| `0 ≤ dias ≤ 30`          | **Próximo ao Vencimento** | 🟡 Âmbar |
| `dias < 0`               | **Vencido**               | 🔴 Vermelho |

**Regra de segurança:** no estado **Vencido**, a ação "Usar" é **bloqueada**,
impedindo o uso indevido e orientando o descarte.

---

## Validação ANVISA (Regex)

O registro do Ministério da Saúde tem **13 dígitos**, exibido como
`X.XXXX.XXXX.XXX-X`. A validação (`src/logic/anvisaValidator.js`) aceita o
formato com pontuação **ou** os 13 dígitos puros:

```
^\d\.\d{4}\.\d{4}\.\d{3}-\d$      (formatado)
^\d{13}$                          (somente dígitos)
```

---

## Limitações do protótipo

- O **OCR é simulado**: a foto é capturada, mas os dados retornados são exemplos
  para o usuário revisar (não há reconhecimento real de texto).
- Os dados são **locais** (AsyncStorage); não há backend, conta de usuário nem
  sincronização entre aparelhos.
- **Não há notificações agendadas** — o alerta de validade é apenas visual
  (selos coloridos dirigidos pela FSM).
- A **lista de pontos de coleta é fixa** (não usa geolocalização real).

---

## Contexto acadêmico

O MediCycle demonstra a aplicação prática da **Teoria da Computação (autômatos)**
para conferir rigor ao controle de segurança em uma aplicação de impacto social,
unindo desenvolvimento móvel à preservação ambiental e à saúde pública.
