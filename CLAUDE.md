# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Diário de Autogoverno** — Web app exclusivo para advogados mentorados por Rafael Coelho (@eusourafaelcoelho). Mentorados registram diariamente situações de pressão, conflito e decisão e recebem reflexões geradas por IA baseadas no framework "Código A.D.V." (Autogoverno, Direção, Verdade). Rafael tem papel duplo: praticante (usa o diário para si, privado) e mentor (dashboard para acompanhar todos os mentorados).

**Status:** Greenfield — nenhum código de aplicação ainda. O framework AIOS (`.aios-core/`) está instalado e pronto para story-driven development.

**Briefing completo do produto:** `diario-autogoverno-briefing.md` (UX flows detalhados, prompts de IA, critérios de sucesso).

## Tech Stack

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth
- **AI:** Anthropic Claude API (reflexões, relatórios semanais, briefings de sessão)
- **Charts:** Recharts ou Chart.js
- **Deploy:** Vercel
- **PWA:** Considerar para instalação mobile sem app store

## Design System

- **Mentee:** Mobile-first — registro em no máximo 3 steps, menos de 5 min
- **Mentor dashboard:** Desktop-first — sidebar com navegação
- **Dark mode** como padrão
- **Paleta:** Preto (#000), Vermelho (#E53935 para destaques), Branco
- **Tipografia:** Clean, sem serifa, moderna
- **Gamificação leve:** Streak counter, badges de consistência

## Build & Development Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build project

# Quality gates (rodar antes de commits)
npm run lint                   # ESLint
npm run typecheck              # TypeScript type checking
npm test                       # Todos os testes (unit + integration)

# Testes individuais
npm run test:unit              # Jest unit tests
npm run test:integration       # Jest integration tests

# AIOS framework
npm run sync:ide               # Sync IDE configurations
npm run sync:ide:check         # Verify IDE sync status
npm run validate:structure     # Validate project structure
npm run validate:agents        # Validate agent definitions

# Diagnostics
aios doctor                    # System health check
aios graph --deps              # Dependency visualization
aios graph --stats             # Entity statistics
```

## Architecture: Two Layers

### 1. AIOS Framework (`.aios-core/`) — READ-ONLY

Meta-framework de orquestração de desenvolvimento. Protegido pelo modelo L1-L4 em `.claude/settings.json`.

- **Core engine** (`core/`): Orchestration, execution, quality gates, code intelligence
- **Agents** (`development/agents/`): 11 personas (Markdown) ativadas via `@agent-name`
- **Tasks** (`development/tasks/`): 206+ definições de tasks executáveis
- **Workflows** (`development/workflows/`): 7 orquestrações (greenfield, brownfield, SDC)
- **Templates** (`product/templates/`): 52+ templates (stories, PRDs, epics)
- **CLI** (`cli/`): Commander.js com subcommands (workers, manifest, qa, mcp, migrate, etc.)

### 2. Project Application (`packages/`, `docs/`, `tests/`) — MUTABLE

- Stories: `docs/stories/` — todas as features começam como stories
- PRD: `docs/prd/` (sharded, v4 format)
- Architecture docs: `docs/architecture/`
- Source code: `packages/`
- Tests: `tests/`

## Data Models

```
User         { id, name, email, role (mentee|mentor), created_at }
DailyEntry   { id, user_id, date, situation, category, emotion, intensity (1-10),
               reaction, self_perception (reactive|strategic|unsure), created_at }
AIReflection { id, entry_id, questions (json), answers (json, nullable), created_at }
WeeklyReport { id, user_id, week_start, week_end, summary, patterns, evolution,
               insight, challenge, created_at }
MentorNote   { id, mentor_id, mentee_id, content, created_at }
SessionBriefing { id, mentor_id, mentee_id, generated_at, summary, patterns,
                  suggested_topics, mentor_previous_notes }
```

**Role `mentor`** herda todas as funcionalidades de `mentee` + acesso ao dashboard. Registros pessoais do Rafael (mentor) são PRIVADOS — nunca visíveis no dashboard de mentor.

## User Flows

### Mentee — Registro Diário (max 5 min)
1. **Home:** Saudação contextual + CTA "Registrar o dia" + streak counter + mini-resumo semanal
2. **Step 1 — "O que aconteceu?":** Texto livre + categoria (chips: Audiência, Negociação, Cliente, Cobrança, Equipe, Decisão, Outro)
3. **Step 2 — "O que você sentiu?":** Emoção (ícones: Ansiedade, Raiva, Medo, Frustração, Insegurança, Culpa, Outro) + slider intensidade 1-10 (cor verde→amarelo→vermelho)
4. **Step 3 — "Como você reagiu?":** Texto livre + autopercepção (Reativa, Estratégica, Não sei)
5. **Reflexão IA:** 2-3 perguntas reflexivas personalizadas, resposta opcional
6. **Confirmação:** "Registro salvo. Mais um dia de autogoverno." + streak atualizado

### Mentor Dashboard (Rafael)
- **Visão Geral:** Cards resumo (ativos, registros semana, engajamento, alertas) + alertas de inatividade
- **Mentorados:** Lista com status visual (🟢 ativo ≤2d, 🟡 ausente 3-5d, 🔴 inativo 5+d) + streak + intensidade média
- **Perfil Mentorado:** Abas Registros, Evolução (gráficos), Relatórios, Padrões IA + Bloco de Notas do Mentor
- **Insights do Grupo:** Painel agregado — top emoções, categorias desafiadoras, evolução geral
- **Pré-sessão:** Briefing automático com IA (resumo + padrões + sugestões + notas anteriores)
- **Meu Diário:** Switch para experiência de praticante (idêntica ao mentee)

## AI Integration Patterns

Três contextos de geração de IA (detalhados no briefing):

1. **Reflexões pós-registro** — 2-3 perguntas reflexivas baseadas no Código A.D.V. Tom: direto, firme, provocativo. Nunca coach motivacional ou terapeuta. "Como um mentor que respeita o mentorado o suficiente para ser honesto."
2. **Relatório semanal automático** — Resumo, padrões identificados, evolução comparativa, insight da semana, desafio prático para próxima semana
3. **Briefing de pré-sessão** — Resumo desde última sessão, padrões emocionais, pontos de atenção (intensidade 8+), sugestões de temas, perguntas sugeridas

**Princípio:** Todo conteúdo de IA deve refletir o método do Rafael, nunca ser genérico.

## MVP Phases

| Fase | Escopo |
|------|--------|
| **1 — Core** | Auth, registro diário, reflexão IA, histórico, dashboard básico mentor |
| **2 — Inteligência** | Relatório semanal IA, gráficos evolução, padrões IA, notas mentor, briefing pré-sessão |
| **3 — Engajamento** | Streaks/badges, lembretes email, insights agregados, perfil evolução |

## AIOS Agent System

Ativar com `@agent-name` ou `/AIOS:agents:agent-name`. Comandos usam prefixo `*`: `*help`, `*create-story`, `*task {name}`, `*exit`.

| Agent | Responsabilidade | Operações Exclusivas |
|-------|-----------------|---------------------|
| `@dev` (Dex) | Implementação | `git add/commit/branch` (local) |
| `@devops` (Gage) | CI/CD, releases | `git push`, `gh pr create/merge`, MCP |
| `@architect` (Aria) | Arquitetura | Technology selection, system design |
| `@data-engineer` (Dara) | Database | Schema DDL, RLS, migrations |
| `@pm` (Morgan) | Product management | Epic creation/execution |
| `@po` (Pax) | Story validation | 10-point checklist |
| `@sm` (River) | Story creation | Drafting from epics/PRD |
| `@qa` (Quinn) | Quality assurance | QA verdicts (PASS/FAIL/CONCERNS) |

**Regra crítica:** Somente `@devops` pode executar `git push` ou criar PRs. Outros agentes devem delegar.

## Primary Workflow: Story Development Cycle (SDC)

```
@sm drafts story → @po validates → @dev implements → @qa gate → @devops pushes
```

## Key Configuration Files

| File | Purpose |
|------|---------|
| `.aios-core/core-config.yaml` | Main AIOS configuration |
| `.claude/CLAUDE.md` | AIOS-managed rules (NÃO modificar blocos AIOS-MANAGED) |
| `.claude/settings.json` | Tool permissions, deny/allow rules |
| `.claude/rules/` | 10 contextual rule files (auto-loaded) |
| `diario-autogoverno-briefing.md` | Briefing completo do produto com UX flows e prompts IA |

## Conventions

- **Idioma:** Português para conteúdo user-facing; inglês para documentação técnica do framework
- **Commits:** Conventional commits com referência à story: `feat: implement login [Story 1.1]`
- **Imports:** Absolute imports com `@/` aliases (Constitution Article VI)
- **Story-driven:** Nunca implementar features sem story correspondente em `docs/stories/`
- **Acesso:** Produto exclusivo por convite — não é público
- **Offline/low-connectivity:** Considerar PWA — advogados em fóruns nem sempre têm boa internet
