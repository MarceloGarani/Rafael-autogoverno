# Diário de Autogoverno — Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Criar o hábito de auto-observação emocional diária nos advogados mentorados por Rafael Coelho
- Fornecer reflexões personalizadas baseadas no framework "Código A.D.V." (Autogoverno, Direção, Verdade) via IA
- Permitir ao mentor (Rafael) acompanhar a evolução emocional de cada mentorado com dados concretos e insights acionáveis
- Identificar padrões emocionais recorrentes para orientar sessões de mentoria com mais precisão
- Garantir que 80%+ dos mentorados registrem pelo menos 4x por semana
- Manter o registro diário abaixo de 5 minutos para máxima adesão
- Suportar o papel duplo de Rafael: praticante (usa o diário para si) e mentor (dashboard para acompanhar todos)

### Background Context

Rafael Coelho é advogado há quase 20 anos e criou o framework "Código A.D.V." — uma metodologia de inteligência emocional aplicada à advocacia. Seus mentorados são advogados que sofrem com a "Obesidade Mental": sobrecarga emocional que os impede de agir estrategicamente. O Diário de Autogoverno é a ferramenta digital que sustenta essa mentoria, transformando a auto-observação em prática diária e dando a Rafael dados concretos para orientar cada sessão. Não existe solução similar no mercado para esse nicho — os apps de journaling existentes são genéricos e não falam a linguagem do advogado em pressão. O produto é exclusivo por convite, reforçando o posicionamento premium da mentoria.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2026-02-27 | 1.0 | Initial PRD creation from project briefing | Morgan (PM) |

---

## Requirements

### Functional

- **FR1:** O sistema deve permitir cadastro e autenticação de usuários com os roles `mentee` e `mentor`, sendo o acesso exclusivo por convite
- **FR2:** O mentorado deve conseguir registrar uma entrada diária em no máximo 3 steps, contendo: situação (texto livre), categoria (Audiência, Negociação, Cliente, Cobrança, Equipe, Decisão, Outro), emoção predominante (Ansiedade, Raiva, Medo, Frustração, Insegurança, Culpa, Outro), intensidade emocional (1-10), reação (texto livre) e autopercepção (Reativa, Estratégica, Não sei)
- **FR3:** Após cada registro, o sistema deve gerar 2-3 perguntas reflexivas personalizadas via IA (Claude API), seguindo o tom direto e provocativo do Código A.D.V. — nunca genérico, coach motivacional ou terapeuta
- **FR4:** O mentorado pode responder opcionalmente às perguntas reflexivas, e as respostas devem ser persistidas junto ao registro
- **FR5:** A home do mentorado deve exibir: saudação contextual (nome + período do dia), CTA principal "Registrar o dia", streak counter de dias consecutivos, e mini-resumo da semana (barra de intensidade dos últimos 7 dias)
- **FR6:** O mentorado deve ter acesso ao histórico de registros com lista cronológica (cards com data, categoria, emoção, intensidade), filtros por período/categoria/emoção, e expansão para ver detalhes completos + perguntas IA + respostas
- **FR7:** O sistema deve gerar automaticamente um relatório semanal por mentorado contendo: resumo, padrões identificados, evolução comparativa, insight da semana (conectado ao A.D.V.) e desafio prático para a próxima semana
- **FR8:** O mentor deve ter um dashboard desktop-first com: visão geral (cards de resumo: mentorados ativos, registros da semana, engajamento médio, alertas), alertas de inatividade (3+ dias sem registro)
- **FR9:** O dashboard do mentor deve listar todos os mentorados com status visual (🟢 ativo ≤2d, 🟡 ausente 3-5d, 🔴 inativo 5+d), streak e intensidade média semanal
- **FR10:** O mentor deve acessar o perfil individual de cada mentorado com abas: Registros (timeline completa), Evolução (gráficos), Relatórios (semanais), Padrões IA (insights automáticos)
- **FR11:** O mentor deve ter um bloco de notas persistente por mentorado para anotar observações para sessões
- **FR12:** O mentor deve poder gerar briefings de pré-sessão com IA contendo: resumo dos registros desde a última sessão, padrões emocionais, pontos de atenção (intensidade 8+), sugestões de temas e perguntas sugeridas
- **FR13:** O sistema deve exibir painel de insights agregados do grupo: top emoções, categorias mais desafiantes, evolução geral da intensidade média
- **FR14:** O role `mentor` herda TODAS as funcionalidades de `mentee` — Rafael pode alternar entre "Meu Diário" (experiência de praticante, idêntica ao mentorado) e "Dashboard Mentor" com toggle/menu sempre acessível
- **FR15:** Os registros pessoais do mentor NÃO devem aparecer no dashboard de mentor — são privados
- **FR16:** O sistema deve implementar gamificação leve: streak counter de dias consecutivos e badges de consistência semanal
- **FR17:** A tela de Evolução (Meu Progresso) do mentorado deve exibir: gráfico de linha (intensidade ao longo das semanas), gráfico de pizza (distribuição de categorias), indicador de % reativo vs. estratégico (evolução mensal), e streaks/badges

### Non Functional

- **NFR1:** O registro diário (3 steps + reflexão IA) deve ser completável em menos de 5 minutos
- **NFR2:** A interface do mentorado deve ser mobile-first e funcionar bem em conexões lentas (advogados em fóruns)
- **NFR3:** O sistema deve considerar PWA para instalação no celular sem app store
- **NFR4:** O sistema deve usar dark mode como padrão com paleta: Preto (#000), Vermelho (#E53935), Branco
- **NFR5:** A tipografia deve ser clean, sem serifa, moderna
- **NFR6:** As reflexões da IA devem ser geradas em no máximo 3 segundos (exibir animação de processamento)
- **NFR7:** Dados de mentorados são estritamente privados — cada mentorado só vê seus dados; apenas o mentor vê os de todos
- **NFR8:** O sistema deve usar autenticação segura via Supabase Auth
- **NFR9:** Row Level Security (RLS) no Supabase deve garantir isolamento de dados entre mentorados
- **NFR10:** O dashboard do mentor deve ser desktop-first com sidebar de navegação
- **NFR11:** O sistema deve ser deployável na Vercel com CI/CD automatizado
- **NFR12:** A API do Claude deve ser chamada server-side (nunca expor chave API no client)

---

## User Interface Design Goals

### Overall UX Vision

Duas experiências distintas otimizadas para seus contextos: o mentorado precisa de um fluxo mobile rápido, emocional e envolvente (registro em menos de 5 minutos, dark mode, feedback visual de intensidade) enquanto o mentor precisa de um painel analítico e acionável (sidebar, gráficos, insights para preparar sessões). O design reflete a identidade do Rafael: direto, sem excessos, preto com vermelho de destaque — nada de "app bonitinho". É uma ferramenta de trabalho emocional para profissionais sérios.

### Key Interaction Paradigms

- **Mentorado:** Wizard/stepper de 3 passos para registro — cada step com foco único (situação → emoção → reação). Interação por chips, ícones e sliders para minimizar digitação. Reflexão IA como reveal progressivo (pergunta por pergunta).
- **Mentor:** Dashboard com navegação por sidebar, drill-down (visão geral → lista → perfil → detalhes), e ações contextuais (gerar briefing, abrir notas). Cards de resumo com indicadores visuais rápidos.
- **Switch mentor/praticante:** Toggle ou item de menu sempre visível para Rafael alternar entre suas duas experiências.

### Core Screens and Views

1. **Login/Cadastro** — Tela de autenticação com branding do Rafael
2. **Onboarding** — Tela única explicando o Diário e o Código A.D.V. (apenas primeiro acesso)
3. **Home Mentorado** — Saudação + CTA registro + streak + mini-resumo semanal
4. **Registro Diário** — Stepper de 3 steps (situação → emoção → reação)
5. **Reflexão IA** — Perguntas reflexivas pós-registro com campos opcionais de resposta
6. **Confirmação** — Feedback de registro salvo + streak atualizado
7. **Histórico** — Lista cronológica com filtros e expansão de detalhes
8. **Meu Progresso** — Gráficos de evolução, categorias, reativo vs. estratégico, badges
9. **Relatório Semanal** — Resumo, padrões, evolução, insight, desafio
10. **Dashboard Mentor — Visão Geral** — Cards de resumo + alertas + atividade recente
11. **Dashboard Mentor — Mentorados** — Lista com status visual, busca e filtros
12. **Dashboard Mentor — Perfil do Mentorado** — Abas (Registros, Evolução, Relatórios, Padrões IA) + Notas
13. **Dashboard Mentor — Insights do Grupo** — Painel agregado
14. **Dashboard Mentor — Pré-sessão** — Briefing gerado por IA
15. **Dashboard Mentor — Meu Diário** — Switch para experiência de praticante

### Accessibility: WCAG AA

O app deve atender critérios WCAG AA — contraste adequado (especialmente importante no dark mode), navegação por teclado, labels semânticos, e compatibilidade com leitores de tela.

### Branding

- **Dark mode como padrão** — alinhado com a identidade visual do Rafael no Instagram
- **Paleta:** Preto (#000000) como background principal, Vermelho (#E53935) para destaques e CTAs, Branco (#FFFFFF) para texto e elementos secundários
- **Tipografia:** Sans-serif moderna e clean (Inter, Geist, ou similar)
- **Tom visual:** Sóbrio, profissional, sem elementos infantis ou excessivamente decorativos
- **Ícones de emoção:** Minimalistas, monocromáticos com destaque sutil

### Target Device and Platforms: Web Responsive

- **Mentorado:** Mobile-first (smartphones iOS/Android via browser ou PWA instalada)
- **Mentor Dashboard:** Desktop-first (browsers modernos em telas ≥1024px)
- **PWA:** Considerar manifest + service worker para instalação no celular e funcionalidade básica offline

---

## Technical Assumptions

### Repository Structure: Monorepo

Monorepo com Next.js — frontend e API routes no mesmo projeto. Estrutura em `packages/` conforme convenção AIOS.

### Service Architecture

Monolith com Next.js — App Router para frontend e API Routes para backend. Supabase como BaaS (banco PostgreSQL + autenticação + storage). A simplicidade do monolith é adequada para o escopo do MVP e a equipe (desenvolvimento assistido por IA).

**Stack definido:**
- **Frontend:** Next.js 14+ com App Router, React 18+, TypeScript
- **Styling:** Tailwind CSS com possível uso de shadcn/ui para componentes base
- **State Management:** Zustand para estado global (se necessário), React Query para server state
- **Backend:** Next.js API Routes (server-side)
- **Database:** PostgreSQL via Supabase (hosted)
- **Auth:** Supabase Auth (email/password, magic link)
- **AI:** Anthropic Claude API (server-side only)
- **Charts:** Recharts para visualizações de dados
- **Deploy:** Vercel (auto-deploy via Git)
- **PWA:** next-pwa para manifest + service worker

### Testing Requirements

Unit + Integration testing:
- **Unit:** Jest + React Testing Library para componentes e utilities
- **Integration:** Jest para API routes e fluxos de dados
- **E2E:** Playwright (fase posterior ao MVP, se necessário)
- **Coverage target:** 80%+ para lógica de negócio crítica

### Additional Technical Assumptions and Requests

- **Absolute imports** com `@/` aliases (conforme Constitution Article VI do AIOS)
- **Conventional commits** com referência a stories: `feat: implement login [Story 1.1]`
- **Environment variables** para chaves de API (Claude, Supabase) — nunca hardcoded
- **RLS (Row Level Security)** no Supabase para isolamento de dados entre usuários
- **Server Components** por padrão no Next.js, Client Components apenas quando necessário (interatividade)
- **Preset ativo:** `nextjs-react` conforme configuração do AIOS

---

## Epic List

### Epic 1: Foundation & Authentication
Estabelecer o projeto Next.js, configurar Supabase (auth + database), implementar autenticação por convite, e entregar a home do mentorado com navegação básica.

### Epic 2: Daily Entry & AI Reflection
Implementar o fluxo completo de registro diário (stepper 3 steps) com integração Claude API para geração de reflexões personalizadas, histórico de registros e confirmação com streak.

### Epic 3: Mentor Dashboard & Mentee Management
Criar o dashboard do mentor com visão geral, lista de mentorados com status visual, perfil individual com abas (registros, notas do mentor), e o switch mentor/praticante.

### Epic 4: Intelligence & Reports
Implementar relatório semanal automático com IA, gráficos de evolução, identificação de padrões pela IA, briefing de pré-sessão, e insights agregados do grupo.

### Epic 5: Engagement & PWA
Implementar sistema de streaks e badges, página de evolução do mentorado (Meu Progresso), lembretes por email, e configuração PWA para instalação mobile.

---

## Epic 1: Foundation & Authentication

**Goal:** Estabelecer a infraestrutura completa do projeto — scaffolding Next.js, configuração Supabase (database + auth), esquema de dados inicial, autenticação por convite, layout base com dark mode, e home do mentorado com saudação contextual. Ao final deste epic, o app estará deployado na Vercel com login funcional e a home renderizando dados do usuário autenticado.

### Story 1.1: Project Scaffolding & Configuration

> As a developer,
> I want to scaffold the Next.js project with all required dependencies and configurations,
> so that the team has a solid foundation to build upon.

**Acceptance Criteria:**

1. Next.js 14+ project initialized with App Router, TypeScript, Tailwind CSS, e ESLint configurados
2. Estrutura de pastas em `packages/web/` conforme convenção AIOS (app/, components/, lib/, types/)
3. Absolute imports com `@/` alias configurados no `tsconfig.json`
4. Dependencies instaladas: `@supabase/supabase-js`, `@supabase/ssr`, `zustand`, `recharts`, `@anthropic-ai/sdk`
5. Arquivo `.env.local.example` com todas as variáveis necessárias (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY)
6. Scripts npm configurados: `dev`, `build`, `lint`, `typecheck`, `test`
7. Tailwind configurado com paleta customizada: preto (#000000), vermelho (#E53935), branco (#FFFFFF)
8. Dark mode habilitado como padrão no Tailwind (class strategy)
9. `npm run build` completa sem erros
10. `npm run lint` passa sem warnings

### Story 1.2: Supabase Database Schema & RLS

> As a data engineer,
> I want to create the database schema with proper RLS policies,
> so that user data is properly isolated and secure.

**Acceptance Criteria:**

1. Tabelas criadas no Supabase: `users` (id, name, email, role, created_at), `daily_entries` (id, user_id, date, situation, category, emotion, intensity, reaction, self_perception, created_at), `ai_reflections` (id, entry_id, questions, answers, created_at)
2. Enums criados para: category (audiencia, negociacao, cliente, cobranca, equipe, decisao, outro), emotion (ansiedade, raiva, medo, frustracao, inseguranca, culpa, outro), self_perception (reactive, strategic, unsure)
3. Foreign keys configuradas corretamente (daily_entries.user_id → users.id, ai_reflections.entry_id → daily_entries.id)
4. RLS habilitado em todas as tabelas
5. Políticas RLS: mentorados só leem/escrevem seus próprios dados; mentor lê dados de todos os mentorados mas NÃO seus próprios no contexto de dashboard
6. Migration files criados em `supabase/migrations/`
7. Seed data com pelo menos 1 usuário mentor e 2 mentorados de teste

### Story 1.3: Authentication Flow

> As a mentee,
> I want to create an account and login securely,
> so that I can access my personal diary.

**Acceptance Criteria:**

1. Página de login (`/login`) com campos email e senha, dark mode, e branding (logo/nome do app)
2. Página de cadastro (`/register`) com campos nome, email, senha — acessível apenas via link de convite (query param `?invite=TOKEN`)
3. Integração com Supabase Auth para criação de conta e login
4. Redirect para `/` (home) após login bem-sucedido
5. Redirect para `/login` quando usuário não autenticado tenta acessar rotas protegidas
6. Middleware Next.js para proteção de rotas autenticadas
7. Logout funcional com limpeza de sessão
8. Mensagens de erro claras para: email já cadastrado, credenciais inválidas, link de convite inválido
9. Estado de loading durante operações de auth

### Story 1.4: Base Layout & Navigation

> As a user,
> I want a consistent, dark-themed layout with proper navigation,
> so that I can move through the app intuitively.

**Acceptance Criteria:**

1. Layout base com dark mode (fundo #000, texto branco, destaques #E53935)
2. **Mentorado:** Bottom navigation mobile com itens: Home, Histórico, Progresso, Perfil
3. **Mentor:** Sidebar navigation desktop com itens: Visão Geral, Mentorados, Insights, Meu Diário, Configurações
4. Layout responsivo — mobile layout para telas <768px, desktop layout para ≥1024px
5. Componente `Header` com nome do app e avatar/nome do usuário
6. Tipografia sans-serif configurada (Inter ou Geist via next/font)
7. Toggle/menu para mentor alternar entre "Dashboard Mentor" e "Meu Diário"
8. Navegação renderiza corretamente baseada no role do usuário (mentee vs mentor)

### Story 1.5: Mentee Home Screen

> As a mentee,
> I want to see a personalized home screen with my streak and a clear call-to-action,
> so that I'm motivated to register my day.

**Acceptance Criteria:**

1. Saudação contextual: "Bom dia/Boa tarde/Boa noite, {nome}" baseada no horário local
2. CTA principal "Registrar o dia" como card/botão grande e visualmente destacado (vermelho #E53935)
3. Streak counter exibindo dias consecutivos de registro (ex: "🔥 7 dias consecutivos") — 0 se nunca registrou
4. Mini-resumo semanal: barra visual mostrando intensidade emocional dos últimos 7 dias (cores verde→amarelo→vermelho)
5. Links rápidos: "Meu histórico" e "Último relatório" (links funcionais, páginas podem estar vazias)
6. Dados carregados do Supabase via Server Components
7. Estado vazio tratado: se não há registros, exibir mensagem de boas-vindas e CTA para primeiro registro
8. Página renderiza corretamente em mobile (≤ 480px) e desktop

---

## Epic 2: Daily Entry & AI Reflection

**Goal:** Implementar o fluxo completo de registro diário com stepper de 3 passos, integração com Claude API para geração de reflexões personalizadas baseadas no Código A.D.V., persistência de dados com respostas opcionais, e tela de histórico com filtros. Ao final, o mentorado poderá completar todo o ciclo: registrar → refletir → consultar.

### Story 2.1: Daily Entry Stepper (Steps 1-3)

> As a mentee,
> I want to register my daily entry through a guided 3-step form,
> so that I can document my emotional experience quickly and easily.

**Acceptance Criteria:**

1. Rota `/entry/new` com stepper de 3 steps com indicador de progresso visual
2. **Step 1 "O que aconteceu?":** Campo de texto livre (placeholder: "Descreva a situação de pressão, conflito ou decisão que enfrentou hoje") + chips clicáveis de categoria (Audiência, Negociação, Cliente, Cobrança, Equipe, Decisão, Outro)
3. **Step 2 "O que você sentiu?":** Seleção de emoção com ícones visuais (Ansiedade, Raiva, Medo, Frustração, Insegurança, Culpa, Outro) + slider de intensidade 1-10 com feedback visual de cor (verde → amarelo → vermelho)
4. **Step 3 "Como você reagiu?":** Campo de texto livre (placeholder: "O que você fez ou disse?") + seleção rápida de autopercepção (Reativa, Estratégica, Não sei)
5. Botão "Voltar" em cada step (exceto o primeiro)
6. Botão "Salvar e refletir →" no step 3
7. Validação: situação (obrigatório, min 10 chars), categoria (obrigatória), emoção (obrigatória), intensidade (obrigatória), reação (obrigatório, min 10 chars), autopercepção (obrigatória)
8. Dados salvos no Supabase via API Route (`POST /api/entries`)
9. UI mobile-first com interações por toque (chips, slider)
10. Estado do formulário preservado entre steps (sem perda de dados ao navegar)

### Story 2.2: AI Reflection Generation

> As a mentee,
> I want to receive personalized reflective questions from AI after my entry,
> so that I can deepen my self-awareness through the A.D.V. framework.

**Acceptance Criteria:**

1. Após salvar a entry, redirecionar para `/entry/{id}/reflection`
2. Animação de "processando" exibida enquanto IA gera reflexões (1-3 segundos)
3. API Route (`POST /api/reflections`) que chama Claude API server-side com system prompt do Código A.D.V. e dados do registro
4. System prompt implementado conforme briefing: tom direto, firme, provocativo; NÃO coach motivacional; NÃO terapeuta; framework A.D.V. (Autogoverno, Direção, Verdade)
5. IA gera exatamente 2-3 perguntas reflexivas personalizadas baseadas no registro
6. Perguntas exibidas uma por vez com campo de texto opcional abaixo de cada uma
7. Mentorado pode responder todas, algumas ou nenhuma
8. Botão "Finalizar" salva respostas (ou null se não respondidas) no Supabase (tabela ai_reflections)
9. Tela de confirmação: "Registro salvo. Mais um dia de autogoverno." + streak atualizado
10. Se a API Claude falhar, exibir mensagem graceful e salvar o registro sem reflexão (não bloquear o fluxo)

### Story 2.3: Entry History & Details

> As a mentee,
> I want to view my past entries with filters and full details,
> so that I can track my emotional patterns over time.

**Acceptance Criteria:**

1. Rota `/history` com lista cronológica de registros (mais recente primeiro)
2. Cada registro exibido como card com: data, categoria (chip colorido), emoção (ícone), intensidade (indicador visual 1-10)
3. Filtros funcionais: por período (última semana, último mês, customizado), por categoria, por emoção
4. Ao clicar em um card: expande/navega para detalhes completos — situação, reação, autopercepção, perguntas da IA e respostas do mentorado
5. Paginação ou infinite scroll para listas longas
6. Estado vazio: mensagem orientativa quando não há registros
7. Dados carregados via API Route (`GET /api/entries`) com filtros como query params
8. Loading states e error handling adequados

---

## Epic 3: Mentor Dashboard & Mentee Management

**Goal:** Criar o dashboard completo do mentor com visão geral agregada, gestão de mentorados com status visual e alertas de inatividade, perfil individual com timeline de registros e notas do mentor, e o switch fluido entre experiência de mentor e praticante. Ao final, Rafael poderá monitorar todos os mentorados e preparar-se para sessões.

### Story 3.1: Mentor Dashboard Overview

> As a mentor,
> I want to see a summary of all mentee activity at a glance,
> so that I can quickly identify who needs attention.

**Acceptance Criteria:**

1. Rota `/dashboard` acessível apenas para role `mentor`
2. Layout desktop-first com sidebar de navegação (Visão Geral, Mentorados, Insights, Meu Diário, Configurações)
3. Cards de resumo: Total de mentorados ativos, Registros esta semana, Engajamento médio (% que registrou nos últimos 2 dias), Alertas pendentes
4. Lista de alertas: mentorados que não registram há 3+ dias com nome e dias de inatividade
5. Atividade recente: últimos 10 registros de mentorados (nome, data, categoria, intensidade — sem detalhes do conteúdo)
6. Dados carregados via API Route (`GET /api/dashboard/overview`) com RLS de mentor
7. Registros pessoais do mentor NÃO aparecem nas métricas do dashboard
8. Loading states para cada seção independente

### Story 3.2: Mentee List & Status

> As a mentor,
> I want to see all my mentees with their current engagement status,
> so that I can prioritize who to follow up with.

**Acceptance Criteria:**

1. Rota `/dashboard/mentees` com lista de todos os mentorados
2. Cada mentorado exibe: avatar/iniciais, nome, data do último registro, streak atual, intensidade média da semana
3. Status visual: 🟢 ativo (registrou nos últimos 2 dias), 🟡 ausente (3-5 dias), 🔴 inativo (5+ dias)
4. Busca por nome funcional
5. Filtro por status (ativo/ausente/inativo)
6. Ordenação padrão: inativos primeiro (maior urgência)
7. Click em mentorado navega para perfil individual (`/dashboard/mentees/{id}`)
8. API Route (`GET /api/dashboard/mentees`) com dados agregados por mentorado

### Story 3.3: Mentee Profile — Records & Notes

> As a mentor,
> I want to view a mentee's complete record timeline and add my own notes,
> so that I can prepare for mentoring sessions.

**Acceptance Criteria:**

1. Rota `/dashboard/mentees/{id}` com perfil completo do mentorado
2. Header: nome, data de início na mentoria, streak atual, total de registros
3. Aba "Registros": timeline completa dos registros (o mentor pode abrir cada um e ler situação, reação, perguntas IA, respostas)
4. Aba com conteúdo placeholder para: Evolução, Relatórios, Padrões IA (implementados no Epic 4)
5. **Bloco de Notas do Mentor:** campo de texto persistente (rich text básico ou textarea) onde Rafael anota observações — autosave
6. API Routes: `GET /api/dashboard/mentees/{id}`, `GET /api/dashboard/mentees/{id}/entries`, `PUT /api/mentor-notes/{menteeId}`
7. RLS garante que apenas o mentor acessa esses dados
8. Loading e error states adequados

### Story 3.4: Mentor-Practitioner Switch

> As a mentor (Rafael),
> I want to seamlessly switch between my mentor dashboard and my personal diary,
> so that I can practice what I teach without mixing contexts.

**Acceptance Criteria:**

1. Item "Meu Diário" na sidebar do mentor que redireciona para a experiência de mentorado
2. Na experiência de mentorado (quando é mentor), exibir botão/toggle "Voltar ao Dashboard" sempre visível
3. A experiência de praticante é idêntica à do mentorado: home com streak, registro diário, reflexão IA, histórico, progresso
4. Os dados pessoais do mentor são completamente isolados — não aparecem em nenhum endpoint do dashboard
5. A transição é fluida — sem recarregamento completo da página (client-side routing)
6. O contexto ativo (mentor vs praticante) é visualmente claro (indicador ou mudança de layout)

---

## Epic 4: Intelligence & Reports

**Goal:** Implementar as camadas de inteligência do sistema: relatório semanal automático gerado por IA, gráficos de evolução emocional, identificação de padrões pela IA, briefing de pré-sessão para o mentor, e painel de insights agregados do grupo. Ao final, o sistema oferecerá análises profundas e acionáveis tanto para mentorados quanto para o mentor.

### Story 4.1: Weekly Report Generation

> As a mentee,
> I want to receive an automated weekly report analyzing my emotional patterns,
> so that I can understand my progress and have a challenge for the next week.

**Acceptance Criteria:**

1. Cron job ou scheduled function que gera relatórios semanais (domingo à noite ou configurável)
2. API Route (`POST /api/reports/weekly`) que agrega registros da semana e chama Claude API
3. Relatório contém: resumo da semana, padrões identificados, evolução comparativa (vs. semana anterior), insight da semana (conectado ao A.D.V.), desafio prático para próxima semana
4. Relatório salvo na tabela `weekly_reports`
5. Rota `/reports/weekly/{id}` para mentorado visualizar relatório com layout dedicado e seções bem definidas
6. Lista de relatórios acessível em `/reports` com links para cada semana
7. Se mentorado tem menos de 3 registros na semana, gerar relatório simplificado com nota sobre consistência
8. Relatório funciona tanto para mentorados quanto para o mentor (quando usando Meu Diário)

### Story 4.2: Evolution Charts

> As a mentee,
> I want to see charts showing my emotional evolution over time,
> so that I can visualize my growth.

**Acceptance Criteria:**

1. Rota `/progress` com dashboard de evolução pessoal
2. Gráfico de linha (Recharts): intensidade emocional média por semana ao longo do tempo
3. Gráfico de pizza/donut: distribuição de categorias (onde a pressão mais aparece)
4. Indicador de % reativo vs. estratégico com evolução mensal (bar chart ou gauge)
5. Seção de streaks e badges conquistados (streak atual, maior streak, total de registros)
6. Dados carregados via API Route (`GET /api/progress`) com agregações server-side
7. Gráficos responsivos — funcionam bem em mobile e desktop
8. Período selecionável: último mês, últimos 3 meses, todo o período

### Story 4.3: Mentor — Evolution & Pattern Tabs

> As a mentor,
> I want to see charts and AI-identified patterns for each mentee,
> so that I can have data-driven mentoring sessions.

**Acceptance Criteria:**

1. Aba "Evolução" no perfil do mentorado (implementada como placeholder no Epic 3): gráficos de intensidade ao longo do tempo, distribuição de categorias, reativo vs. estratégico — mesmos componentes da Story 4.2 reutilizados com dados do mentorado
2. Aba "Relatórios": lista de todos os relatórios semanais do mentorado (o mentor pode abrir e ler cada um)
3. Aba "Padrões IA": insights identificados automaticamente (ex: "Ansiedade recorrente em audiências — 80% dos registros dessa categoria têm intensidade 8+")
4. Padrões gerados via API Route com Claude API, analisando todo o histórico do mentorado
5. Dados atualizados dinamicamente — refletem os registros mais recentes

### Story 4.4: Pre-Session Briefing

> As a mentor,
> I want to generate an AI-powered briefing before a mentoring session,
> so that I enter the session prepared with concrete insights.

**Acceptance Criteria:**

1. Botão "Gerar briefing de sessão" no perfil do mentorado
2. API Route (`POST /api/briefings`) que coleta registros desde a última sessão/briefing + notas do mentor e chama Claude API
3. Briefing gerado contém: resumo dos registros (máx 3 parágrafos), padrões emocionais (conectados ao A.D.V.), pontos de atenção (intensidade 8+, padrões repetitivos), 3 sugestões de temas, perguntas sugeridas para o mentor fazer
4. Briefing salvo na tabela `session_briefings`
5. Briefing exibido em layout limpo, imprimível (CSS print-friendly)
6. Histórico de briefings acessível no perfil do mentorado
7. System prompt segue especificação do briefing: direto, prático, acionável para o mentor

### Story 4.5: Group Insights Panel

> As a mentor,
> I want to see aggregated insights across all mentees,
> so that I can identify group trends and adjust my content/sessions.

**Acceptance Criteria:**

1. Rota `/dashboard/insights` com painel de insights agregados
2. "Top 3 emoções mais registradas esta semana" com contagem e percentual
3. "Categoria mais desafiadora do grupo" com percentual
4. "Evolução geral: intensidade média" com comparativo mensal (ex: "caiu de 7.2 para 6.1")
5. Distribuição reativo vs. estratégico do grupo com evolução
6. Dados agregados excluem registros pessoais do mentor
7. Período selecionável: última semana, último mês
8. Visualizações com Recharts (bar charts, line charts para tendências)

---

## Epic 5: Engagement & PWA

**Goal:** Implementar as funcionalidades de engajamento que sustentam o hábito diário: sistema de gamificação com streaks e badges, lembretes por email, e configuração PWA para instalação no celular. Ao final, o app estará otimizado para retenção e acessibilidade mobile.

### Story 5.1: Streak & Badge System

> As a mentee,
> I want to earn streaks and badges for consistency,
> so that I'm motivated to maintain my daily practice.

**Acceptance Criteria:**

1. Lógica de streak: incrementa ao registrar em dias consecutivos, reseta quando pula um dia, calcula streak atual e maior streak
2. Streak exibido na home e na tela de confirmação pós-registro
3. Badges de consistência: "7 dias" (primeira semana completa), "30 dias" (primeiro mês), "Semana perfeita" (7/7 dias), "Mestre do Autogoverno" (90 dias)
4. Tabela `badges` no banco: id, user_id, badge_type, earned_at
5. Notificação in-app ao conquistar um badge
6. Badges visíveis na tela de Progresso/Evolução
7. Lógica de badges roda automaticamente após cada registro (via trigger ou lógica na API)

### Story 5.2: Email Reminders

> As a mentee,
> I want to receive email reminders to register my day,
> so that I don't forget my daily practice.

**Acceptance Criteria:**

1. Email reminder enviado diariamente (20h ou horário configurável) para mentorados que ainda não registraram no dia
2. Conteúdo do email: "Como foi seu dia na advocacia?" com link direto para o formulário de registro
3. Integração com serviço de email (Resend ou Supabase Edge Functions com SMTP)
4. Mentorado pode desativar lembretes nas configurações
5. Não enviar para mentorados que já registraram no dia
6. Template de email alinhado com branding (dark mode, cores, tom direto)

### Story 5.3: PWA Configuration

> As a mentee,
> I want to install the app on my phone like a native app,
> so that I can access it quickly without opening a browser.

**Acceptance Criteria:**

1. Web App Manifest configurado com: nome, short_name, ícones, theme_color (#000000), background_color (#000000), display: standalone
2. Service Worker básico registrado para caching de assets estáticos
3. App instalável via "Adicionar à tela inicial" no Chrome/Safari mobile
4. Ícone do app na tela inicial com branding adequado
5. Splash screen configurada no manifest
6. Meta tags adequadas para iOS (apple-mobile-web-app-capable, status-bar-style)
7. Funciona corretamente quando aberta como standalone (sem barra do browser)

---

## Checklist Results Report

### Executive Summary

- **Overall PRD completeness:** 95%
- **MVP scope appropriateness:** Just Right — 5 epics com escopo bem definido, fases incrementais que entregam valor progressivo
- **Readiness for architecture phase:** READY
- **Most critical considerations:** Definir estratégia de cron/scheduled functions para relatórios semanais (Vercel Cron vs Edge Functions); esquema de convite/token para cadastro exclusivo

### Category Statuses

| Category | Status | Critical Issues |
|----------|--------|-----------------|
| 1. Problem Definition & Context | PASS | Nenhum — briefing extremamente detalhado |
| 2. MVP Scope Definition | PASS | Escopo bem definido em fases, out-of-scope claro |
| 3. User Experience Requirements | PASS | Flows detalhados no briefing, screens mapeadas |
| 4. Functional Requirements | PASS | 17 FRs cobrindo todos os fluxos |
| 5. Non-Functional Requirements | PASS | 12 NFRs com critérios mensuráveis |
| 6. Epic & Story Structure | PASS | 5 epics, 17 stories sequenciais com ACs testáveis |
| 7. Technical Guidance | PASS | Stack definido, preset ativo, padrões claros |
| 8. Cross-Functional Requirements | PARTIAL | Data schema definido; integrações (email service) precisam detalhamento em story |
| 9. Clarity & Communication | PASS | Linguagem clara, terminologia consistente |

### Critical Deficiencies

Nenhum blocker identificado. Itens de atenção:

- **MEDIUM:** Estratégia de scheduled jobs para relatórios semanais — Vercel Cron Jobs (free tier: 1/dia) ou Supabase Edge Functions com pg_cron
- **MEDIUM:** Definir serviço de email (Resend recomendado pela integração com Vercel)
- **LOW:** Considerar onboarding mais detalhado (tour guiado) em fase posterior ao MVP

### Recommendations

1. Iniciar com Epic 1 imediatamente — sem dependências externas
2. Configurar projeto Supabase antes de iniciar Story 1.2
3. Obter chave API do Claude antes de Epic 2
4. Para relatórios semanais, usar Vercel Cron Jobs (simplifica arquitetura)
5. Para email, usar Resend (free tier generoso, integração nativa com Vercel)

### Final Decision

**READY FOR ARCHITECT** — O PRD está completo, bem estruturado, e pronto para o design arquitetural. As 17 stories cobrem todos os fluxos do briefing com acceptance criteria testáveis. A stack está definida e alinhada com o preset AIOS.

---

## Next Steps

### UX Expert Prompt

> @ux-design-expert Revise o PRD em `docs/prd.md` e crie o design system detalhado e wireframes para o Diário de Autogoverno. Foco em: (1) componentes do stepper de registro diário mobile-first, (2) cards e visualizações do dashboard do mentor desktop-first, (3) sistema de cores dark mode com a paleta Preto/Vermelho/Branco, (4) tipografia e spacing. Use o briefing em `diario-autogoverno-briefing.md` como referência de UX flows.

### Architect Prompt

> @architect Revise o PRD em `docs/prd.md` e crie a arquitetura técnica completa para o Diário de Autogoverno. Stack definida: Next.js 14+ (App Router), Supabase (PostgreSQL + Auth), Claude API, Tailwind CSS, Recharts, Vercel. Foco em: (1) estrutura de pastas e módulos, (2) schema DDL detalhado com RLS policies, (3) padrões de API Routes, (4) estratégia de integração Claude API server-side, (5) estratégia de caching e performance, (6) PWA setup. Use o preset `nextjs-react` como base.
