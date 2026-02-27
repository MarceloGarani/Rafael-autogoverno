# PROJECT BRIEFING — Diário de Autogoverno

## Contexto do Cliente

**Rafael Coelho** (@eusourafaelcoelho) é advogado há quase 20 anos, dono de escritório, e mentor de inteligência emocional aplicada à advocacia. Ele criou o framework **"Código A.D.V."** baseado em três pilares:

- **A** — Autogoverno
- **D** — Direção
- **V** — Verdade

### Posicionamento e Linguagem

Rafael fala diretamente para advogados que:

- Sentem o **peso da profissão** mas sabem que são bons
- Fizeram diversos cursos (legislação, gestão) mas não conseguem aplicar
- Vivem com **"Obesidade Mental"** — sobrecarga que os impede de progredir
- Estão presos no modo **reativo** e querem tomar decisões estratégicas
- Precisam de firmeza em negociações, equilíbrio em audiências e tranquilidade com clientes

**Tom de comunicação:** direto, firme, sem motivação rasa. Ele não fala como coach nem como terapeuta — fala como quem "precisou dominar o próprio emocional para continuar de pé". É prático e sem rodeios.

### O que ele entrega na mentoria

- Consciência em lidar com pessoas (colaboradores e clientes)
- Tranquilidade e equilíbrio em audiências
- Firmeza em negociações
- Noites bem dormidas
- Cobrança sem culpa e sem bloqueio de merecimento
- Decisões estratégicas (não reativas ou desesperadas)
- Aumento da qualidade em todas as áreas da vida

---

## Produto: Diário de Autogoverno

### Visão Geral

Web app onde advogados mentorados registram diariamente situações de pressão, conflito e decisão que enfrentaram. A IA conduz reflexões baseadas no método do Rafael (Código A.D.V.), identifica padrões emocionais e gera relatórios. Rafael tem um dashboard para acompanhar a evolução dos mentorados.

**Rafael também usa o diário para si mesmo.** Ele é advogado atuante e vive a mesma pressão. O app precisa suportar o papel duplo: Rafael como mentor (vê o dashboard de todos) E como praticante (faz seus próprios registros, recebe suas próprias reflexões). Isso reforça a autenticidade do método — ele pratica o que ensina.

### Objetivo Principal

**Engajamento diário dos mentorados** — o produto precisa criar o hábito de auto-observação emocional e manter o advogado conectado ao processo de mentoria todos os dias.

---

## Perfis de Usuário

### 1. Mentorado (advogado)
- Faz registros diários
- Recebe perguntas reflexivas da IA
- Visualiza seu histórico e evolução
- Recebe relatórios semanais

### 2. Mentor (Rafael)
- **Como praticante:** Faz seus próprios registros diários, recebe reflexões da IA, tem seu próprio histórico e relatórios — experiência idêntica ao mentorado
- **Como mentor:** Acessa o dashboard administrativo para ver todos os mentorados, padrões, gráficos e preparar sessões
- **Switch de contexto:** No app, Rafael alterna entre "Meu Diário" (sua experiência pessoal) e "Dashboard Mentor" (visão dos mentorados) com um toggle ou menu

> **Nota técnica:** O role do Rafael no banco é `mentor`, que herda todas as funcionalidades de `mentee` + acesso ao dashboard. Os registros pessoais do Rafael NÃO aparecem no dashboard de mentor (são privados dele).

---

## Experiência do Usuário (UX Flows)

### Jornada Completa do Mentorado

#### Primeiro Acesso
1. Recebe link de convite do Rafael (email ou WhatsApp)
2. Abre o app → Tela de boas-vindas com mensagem do Rafael: *"Você não é o número da sua OAB. Aqui começa o seu processo de autogoverno."*
3. Cria conta (nome, email, senha)
4. Onboarding rápido (1 tela): explica o que é o Diário, como funciona, e o Código A.D.V.
5. Já cai direto na tela de primeiro registro com um prompt: *"Como foi seu dia na advocacia? Registre a situação que mais te marcou."*

#### Rotina Diária (fluxo principal — máx. 5 min)

**Tela 1 — Home**
- Saudação contextual: "Boa noite, Marcos." (sem motivação genérica)
- Card principal: "Registrar o dia" (CTA grande e óbvio)
- Streak counter: "🔥 7 dias consecutivos"
- Mini-resumo da semana: barra de intensidade emocional dos últimos 7 dias
- Acesso rápido: "Meu histórico" | "Último relatório"

**Tela 2 — Registro (formulário guiado em steps)**

*Step 1: "O que aconteceu?"*
- Campo de texto livre (placeholder: "Descreva a situação de pressão, conflito ou decisão que enfrentou hoje")
- Seleção de categoria (chips clicáveis): Audiência | Negociação | Cliente | Cobrança | Equipe | Decisão | Outro

*Step 2: "O que você sentiu?"*
- Seleção de emoção (ícones visuais): Ansiedade | Raiva | Medo | Frustração | Insegurança | Culpa | Outro
- Slider de intensidade (1-10) com feedback visual (cor muda de verde → amarelo → vermelho)

*Step 3: "Como você reagiu?"*
- Campo de texto livre (placeholder: "O que você fez ou disse?")
- Seleção rápida: "Minha reação foi..." → Reativa | Estratégica | Não sei
- Botão: "Salvar e refletir →"

**Tela 3 — Reflexão com IA**
- Animação sutil de "processando" (1-2 segundos)
- Aparecem 2-3 perguntas da IA, uma por vez, com espaço para resposta
- Cada pergunta tem campo de texto opcional abaixo
- O mentorado pode responder todas, algumas, ou nenhuma
- Botão "Finalizar" salva tudo
- Tela de confirmação: "Registro salvo. Mais um dia de autogoverno. 🔥" + streak atualizado

#### Consulta de Histórico

- Lista cronológica dos registros (cards com data, categoria, emoção, intensidade)
- Filtros: por período, categoria, emoção
- Ao tocar em um registro: expande para ver detalhes completos + perguntas da IA + respostas

#### Relatório Semanal

- Push notification / email: "Seu relatório semanal está pronto"
- Tela dedicada com o relatório completo
- Seções: Resumo → Padrões → Evolução (gráfico) → Insight → Desafio da semana
- Botão para compartilhar com o mentor (opcional, caso queira discutir na sessão)

#### Tela de Evolução (Meu Progresso)

- Gráfico de linha: intensidade emocional ao longo das semanas
- Gráfico de pizza: distribuição de categorias (onde a pressão mais aparece)
- Indicador: % reativo vs. estratégico (evolução mensal)
- Streaks e badges conquistados
- Frase motivacional do método: rotativa, baseada no A.D.V.

---

### Jornada do Rafael (Mentor + Praticante)

#### Experiência como Praticante

Rafael acessa "Meu Diário" e tem **exatamente a mesma experiência** do mentorado: registro, reflexões da IA, histórico, relatórios semanais, evolução pessoal. Isso é importante porque:
- Ele vive o que ensina (autenticidade)
- Pode mostrar o app funcionando para si mesmo em conteúdo/stories
- Testa o produto como usuário real

#### Experiência como Mentor (Dashboard)

**Navegação:** Menu lateral (sidebar) com:
- 🏠 Visão Geral
- 👥 Mentorados
- 📊 Insights do Grupo
- 📝 Meu Diário (switch para modo praticante)
- ⚙️ Configurações

**Tela: Visão Geral**
- Cards de resumo: Total de mentorados ativos | Registros esta semana | Engajamento médio | Alertas
- Lista de alertas: "⚠️ Ana não registra há 4 dias" | "🔥 Pedro completou 30 dias de streak"
- Atividade recente: últimos registros de mentorados (sem detalhes — apenas nome, data, categoria, intensidade)

**Tela: Mentorados**
- Lista com: foto/avatar, nome, último registro (data), streak, intensidade média da semana
- Status visual: 🟢 ativo (registrou nos últimos 2 dias) | 🟡 ausente (3-5 dias) | 🔴 inativo (5+ dias)
- Busca e filtro por status

**Tela: Perfil do Mentorado (ao clicar em um nome)**
- Header: nome, início na mentoria, streak atual, total de registros
- Aba "Registros": timeline completa (Rafael pode abrir cada um e ler tudo)
- Aba "Evolução": gráficos de intensidade, categorias, reativo vs. estratégico ao longo do tempo
- Aba "Relatórios": todos os relatórios semanais gerados
- Aba "Padrões IA": insights identificados automaticamente ("Ansiedade recorrente em audiências — 80% dos registros dessa categoria têm intensidade 8+")
- **Bloco de Notas do Mentor**: campo de texto persistente onde Rafael anota observações para usar nas sessões. Ex: "Abordar o padrão de culpa na cobrança — apareceu 3x nas últimas 2 semanas"

**Tela: Insights do Grupo**
- Painel agregado de todos os mentorados
- "Top 3 emoções mais registradas esta semana"
- "Categoria mais desafiadora do grupo: Audiências (42%)"
- "Evolução geral: intensidade média caiu de 7.2 para 6.1 no último mês"
- Útil para Rafael criar conteúdo ou ajustar temas das sessões de grupo

**Tela: Pré-sessão (funcionalidade especial)**
- Rafael seleciona um mentorado antes de uma sessão individual
- O app gera um "briefing de sessão" automático com IA:
  - Resumo dos registros desde a última sessão
  - Padrões identificados
  - Sugestões de temas para abordar
  - Notas anteriores do mentor
- Rafael pode imprimir ou manter aberto durante a sessão

---

### Fluxos de Interação Chave

#### Notificação → Registro (caminho mais comum)

```
Notificação push (20h): "Como foi seu dia na advocacia?"
  → Abre o app direto no formulário de registro
    → Preenche (3 steps rápidos)
      → Recebe reflexões da IA
        → Responde ou pula
          → "Registro salvo. 🔥 8 dias de streak"
```
Tempo total: 3-5 minutos

#### Rafael: Preparação pré-sessão

```
Rafael abre Dashboard → Mentorados → Clica no nome
  → Vê registros recentes + padrões
    → Lê notas anteriores que fez
      → Clica "Gerar briefing de sessão"
        → IA gera resumo + sugestões
          → Rafael anota novos pontos
```
Tempo total: 5-10 minutos

#### Mentorado: Check-in semanal

```
Domingo: recebe relatório semanal (email/push)
  → Abre relatório no app
    → Lê resumo, padrões, insight
      → Vê o desafio da semana
        → Acessa "Meu Progresso" para ver evolução
```

---

## Funcionalidades (v1 Completa)

### 1. Registro Diário do Mentorado

O advogado acessa o app e faz um registro rápido (máximo 5 minutos). O fluxo deve ser guiado e simples:

**Campos do registro:**

- **Situação:** Descrição livre do que aconteceu (texto)
- **Categoria:** Audiência | Negociação | Cliente difícil | Cobrança | Conflito interno (sócios/equipe) | Decisão importante | Outro
- **Emoção predominante:** Ansiedade | Raiva | Medo | Frustração | Insegurança | Culpa | Outro
- **Intensidade emocional:** Escala 1-10
- **Como reagiu:** Descrição livre
- **Autopercepção:** "Minha reação foi: Reativa / Estratégica / Não sei"

### 2. Reflexão com IA (pós-registro)

Após o registro, a IA gera **2-3 perguntas reflexivas personalizadas** baseadas no que foi escrito. As perguntas devem seguir a filosofia do Código A.D.V.:

**Princípios para as perguntas:**

- **Autogoverno:** "Você estava no controle ou foi controlado pela situação?"
- **Direção:** "Essa reação te aproximou ou te afastou do advogado que você quer ser?"
- **Verdade:** "O que você não está querendo ver sobre esse padrão?"

**Tom das perguntas:** Direto, provocativo (no bom sentido), sem condescendência. Como o Rafael falaria. Nunca usar tom de "coach motivacional" ou "terapeuta acolhedor demais". Ser firme e prático.

**Exemplos de perguntas da IA:**

- "Você percebeu que essa é a terceira vez este mês que a ansiedade toma conta antes de audiências? O que você ainda não enfrentou sobre isso?"
- "Cobrar é parte da advocacia. Se você sente culpa ao cobrar, o problema não é a cobrança — é o que você acredita sobre merecimento. O que precisa mudar aí?"
- "Reagir com raiva numa negociação não é firmeza. É descontrole disfarçado. Qual seria a resposta de alguém com autogoverno nessa mesma situação?"

O mentorado pode responder as perguntas (opcional) e essas respostas também são salvas.

### 3. Relatório Semanal Automático

Todo domingo (ou dia configurável), o sistema gera um relatório para o mentorado contendo:

- **Resumo da semana:** Quantos registros, categorias mais frequentes, emoções predominantes
- **Padrões identificados:** "Você registrou ansiedade em 4 de 5 dias. Em 3 deles, era relacionado a audiências."
- **Evolução:** Comparativo com semanas anteriores (intensidade média, proporção reativo vs. estratégico)
- **Insight da semana:** Uma reflexão mais profunda da IA sobre o padrão dominante, conectada ao Código A.D.V.
- **Desafio da próxima semana:** Uma micro-prática sugerida pela IA (ex: "Antes de cada audiência, pare 2 minutos e escreva qual resultado você quer — não o que teme")

### 4. Dashboard do Mentor (Rafael)

Painel administrativo onde Rafael visualiza todos os mentorados:

**Visão geral:**

- Lista de mentorados com status (ativo/inativo, dias desde último registro)
- Alerta de mentorados que não registram há 3+ dias
- Ranking de engajamento (quem mais registra)

**Visão individual do mentorado:**

- Timeline de registros
- Gráficos: evolução da intensidade emocional, distribuição de categorias, proporção reativo/estratégico ao longo do tempo
- Padrões identificados pela IA
- Relatórios semanais gerados
- Campo de notas do mentor (Rafael anota observações para usar nas sessões)

**Insights agregados:**

- Problemas mais comuns entre todos os mentorados (ex: "70% dos mentorados relatam ansiedade pré-audiência")
- Tendências de evolução do grupo

---

## Arquitetura Técnica Sugerida

### Stack

- **Frontend:** React (Next.js) com Tailwind CSS
- **Backend:** Next.js API Routes ou Node.js/Express
- **Banco de dados:** PostgreSQL (Supabase para agilizar) ou SQLite para MVP
- **Autenticação:** Supabase Auth ou NextAuth.js
- **IA:** API da Anthropic (Claude) para gerar perguntas reflexivas e relatórios
- **Deploy:** Vercel

### Modelos de Dados Principais

```
User {
  id, name, email, role (mentee | mentor), created_at
  // mentor role inherits ALL mentee features + dashboard access
  // Rafael's personal entries are private (not visible in mentor dashboard)
}

DailyEntry {
  id, user_id, date, situation (text), category (enum),
  emotion (enum), intensity (1-10), reaction (text),
  self_perception (reactive | strategic | unsure),
  created_at
}

AIReflection {
  id, entry_id, questions (json), answers (json, nullable),
  created_at
}

WeeklyReport {
  id, user_id, week_start, week_end,
  summary (json), patterns (json), evolution (json),
  insight (text), challenge (text),
  created_at
}

MentorNote {
  id, mentor_id, mentee_id, content (text),
  created_at
}

SessionBriefing {
  id, mentor_id, mentee_id, generated_at,
  summary (text), patterns (json), suggested_topics (json),
  mentor_previous_notes (text)
}
```

### Fluxo de IA

**Para perguntas reflexivas (pós-registro):**

```
System Prompt:
"Você é o assistente do método Código A.D.V. do Dr. Rafael Coelho.
Seu papel é fazer perguntas reflexivas para advogados que registraram
situações de pressão emocional. Você NÃO é coach, NÃO é terapeuta.
Você fala como alguém que viveu a pressão da advocacia e sabe que
autogoverno se constrói com verdade e direção.

Tom: direto, firme, provocativo. Sem motivação rasa. Sem acolhimento
excessivo. Como um mentor que respeita o mentorado o suficiente para
ser honesto.

Framework A.D.V.:
- Autogoverno: capacidade de se regular emocionalmente antes de agir
- Direção: clareza sobre quem você quer ser e agir alinhado a isso
- Verdade: coragem de enxergar os próprios padrões sem romantizar

Gere exatamente 2-3 perguntas reflexivas baseadas no registro abaixo.
As perguntas devem provocar autoexame real, não conforto."

User: [dados do registro do dia]
```

**Para relatório semanal:**

```
System Prompt:
"Você é o assistente analítico do método Código A.D.V. Analise os
registros da semana e gere um relatório estruturado. Identifique
padrões, conecte com o framework A.D.V., e sugira um desafio prático
para a próxima semana. Seja específico — use os dados reais do
mentorado. Não generalize."

User: [todos os registros da semana em JSON]
```

**Para briefing de pré-sessão (usado pelo Rafael no dashboard):**

```
System Prompt:
"Você é o assistente do Dr. Rafael Coelho para preparação de sessões
de mentoria. Com base nos registros do mentorado desde a última sessão,
gere um briefing conciso e acionável contendo:

1. Resumo dos registros (máx. 3 parágrafos)
2. Padrões emocionais identificados (conectar ao A.D.V.)
3. Pontos de atenção (situações com intensidade 8+, padrões repetitivos)
4. 3 sugestões de temas para abordar na sessão
5. Perguntas que o mentor pode fazer

Seja direto e prático. O objetivo é que o Rafael entre na sessão
preparado e com insights concretos sobre o mentorado."

User: [registros desde última sessão + notas anteriores do mentor em JSON]
```

---

## UI/UX Guidelines

### Para o mentorado

- **Mobile-first** — advogados vão registrar no celular entre compromissos
- **Dark mode** como padrão (alinhado com a identidade visual do Rafael no Instagram)
- **Cores:** Preto (#000), Vermelho (#E53935 — usado nos destaques dele), Branco
- **Tipografia:** Clean, sem serifa, moderna
- **Registro em no máximo 3 telas/steps** — precisa ser rápido
- **Gamificação leve:** streak de dias consecutivos, badge semanal de consistência
- **Notificação/reminder:** Banner ou email lembrando de registrar (configurável)

### Para o mentor (dashboard)

- **Desktop-first** — Rafael vai usar no computador
- Layout tipo admin panel com sidebar
- Visualizações com gráficos (Recharts ou Chart.js)
- Foco em acionabilidade: informação que Rafael pode usar diretamente nas sessões

---

## Escopo do MVP (o que construir primeiro)

### Fase 1 — Core (semana 1-2)

1. Autenticação (login/cadastro)
2. Formulário de registro diário
3. Integração com Claude API para perguntas reflexivas
4. Histórico de registros do mentorado
5. Dashboard básico do mentor (lista de mentorados + registros)

### Fase 2 — Inteligência (semana 3-4)

1. Relatório semanal automático com IA
2. Gráficos de evolução no dashboard do mentor
3. Identificação de padrões pela IA
4. Notas do mentor por mentorado
5. Briefing de pré-sessão com IA

### Fase 3 — Engajamento (semana 5-6)

1. Sistema de streaks e badges
2. Lembretes por email
3. Insights agregados no dashboard do mentor
4. Página de perfil do mentorado com visão de evolução

---

## Critérios de Sucesso

- **80%+ dos mentorados** registram pelo menos 4x por semana
- Rafael consegue abrir o dashboard antes de uma sessão e ter insights prontos
- Mentorados relatam que as perguntas da IA "acertam em cheio"
- O registro diário leva **menos de 5 minutos**

---

## Notas Importantes

- O produto é **exclusivo para mentorados do Rafael** — não é público. O acesso é por convite/cadastro aprovado
- **Rafael usa o app para si mesmo também** — seus registros pessoais são privados e não aparecem no dashboard de mentor
- Todo o conteúdo de IA deve refletir o método do Rafael, não ser genérico
- A privacidade dos registros é fundamental — cada mentorado só vê os seus dados; apenas Rafael (mentor) vê os dos mentorados
- O sistema deve funcionar bem offline/com conexão lenta (advogados em fóruns nem sempre têm boa internet)
- Considerar PWA para instalação no celular sem app store
- O switch entre "Meu Diário" e "Dashboard Mentor" deve ser fluido e sempre acessível para o Rafael
