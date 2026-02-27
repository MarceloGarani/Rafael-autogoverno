# Squad: Diário de Autogoverno

Squad de domínio para o **Diário de Autogoverno** — web app de registro emocional diário para advogados mentorados por Rafael Coelho, com reflexões IA baseadas no Código A.D.V.

## Agents

| Agent | Icon | Role |
|-------|------|------|
| `entry-manager` | 📝 | Fluxo de registro diário (stepper 3 steps, validação, persistência) |
| `ai-reflection` | 🧠 | Interações com Claude API (reflexões, relatórios, briefings, padrões) |
| `mentor-dashboard` | 📊 | Dashboard do mentor (visão geral, mentorados, alertas, insights) |
| `mentee-profile` | 👤 | Perfil individual do mentorado (timeline, evolução, notas) |
| `engagement` | 🔥 | Gamificação e retenção (streaks, badges, lembretes) |

## Tasks (21)

### entry-manager (4)
- `create-entry` — Criar registro diário
- `list-entries` — Listar registros com filtros
- `get-entry` — Detalhes do registro + reflexão IA
- `validate-entry` — Validar dados de entrada

### ai-reflection (5)
- `generate-reflection` — 2-3 perguntas reflexivas pós-registro
- `save-reflection-answers` — Salvar respostas às reflexões
- `generate-weekly-report` — Relatório semanal automático
- `generate-briefing` — Briefing de pré-sessão para mentor
- `identify-patterns` — Identificar padrões emocionais

### mentor-dashboard (4)
- `dashboard-overview` — Visão geral com cards e alertas
- `list-mentees` — Lista de mentorados com status visual
- `mentee-alerts` — Alertas de inatividade (3+ dias)
- `group-insights` — Insights agregados do grupo

### mentee-profile (4)
- `view-profile` — Perfil do mentorado (header + stats)
- `mentee-evolution` — Gráficos de evolução emocional
- `mentee-reports` — Relatórios semanais do mentorado
- `manage-notes` — Notas do mentor (autosave)

### engagement (4)
- `calculate-streak` — Streak atual e maior streak
- `check-badges` — Verificar e conceder badges
- `send-reminder` — Lembretes diários por email
- `progress-summary` — Resumo de progresso (Meu Progresso)

## Integrations

- **Supabase** — PostgreSQL, Auth, RLS
- **Anthropic Claude API** — Reflexões, relatórios, briefings
- **Vercel** — Deploy, Cron Jobs
- **Resend** — Email reminders

## Usage

```bash
# Ativar um agent do squad
@entry-manager

# Executar um comando
*create-entry

# Validar o squad
@squad-creator *validate-squad diario-autogoverno
```

## Source

- **Blueprint:** `./squads/.designs/diario-autogoverno-squad-design.yaml`
- **PRD:** `./docs/prd.md`
- **Briefing:** `./diario-autogoverno-briefing.md`
