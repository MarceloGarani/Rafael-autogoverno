---
task: Dashboard Overview
responsavel: "@mentor-dashboard"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentor_id: ID do mentor autenticado
Saida: |
  - active_mentees: Contagem de mentorados ativos
  - weekly_entries: Contagem de registros desta semana
  - avg_engagement: Percentual de engajamento médio
  - alerts[]: Lista de mentorados inativos (name, days_inactive)
  - recent_activity[]: Últimos 10 registros (name, date, category, intensity)
Checklist:
  - "[ ] Contar mentorados que registraram nos últimos 2 dias"
  - "[ ] Contar total de registros da semana corrente"
  - "[ ] Calcular engajamento médio (% que registrou nos últimos 2 dias)"
  - "[ ] Listar mentorados com 3+ dias sem registro"
  - "[ ] Buscar últimos 10 registros (sem conteúdo, apenas metadata)"
  - "[ ] EXCLUIR registros pessoais do mentor das métricas"
---

# *dashboard-overview

Visão geral do dashboard do mentor com cards de resumo, alertas de inatividade e atividade recente.

## Cards

| Card | Metric | Source |
|------|--------|--------|
| Mentorados Ativos | Count where last_entry <= 2 days | daily_entries |
| Registros esta Semana | Count where date >= week_start | daily_entries |
| Engajamento Médio | % mentees with entry in last 2 days | daily_entries |
| Alertas | Count where last_entry >= 3 days | daily_entries |

## Privacy

Registros pessoais do mentor (Rafael) são EXCLUÍDOS de todas as métricas.

## API

- **Route:** `GET /api/dashboard/overview`
- **Auth:** Required (mentor only)

## Related

- **Agent:** mentor-dashboard
- **Stories:** Story 3.1 (Mentor Dashboard Overview)
