---
task: Group Insights
responsavel: "@mentor-dashboard"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentor_id: ID do mentor
  - period: week | month
Saida: |
  - top_emotions[]: { emotion, count, percentage } (top 3)
  - challenging_categories[]: { category, percentage }
  - avg_intensity_trend: { current, previous, direction }
  - reactive_vs_strategic: { reactive_pct, strategic_pct, trend }
Checklist:
  - "[ ] Agregar emoções de todos os mentorados no período"
  - "[ ] Agregar categorias de todos os mentorados no período"
  - "[ ] Calcular intensidade média atual vs. período anterior"
  - "[ ] Calcular ratio reativo vs. estratégico com tendência"
  - "[ ] EXCLUIR registros pessoais do mentor"
---

# *group-insights

Painel de insights agregados de todos os mentorados.

## Insights

- "Top 3 emoções mais registradas esta semana"
- "Categoria mais desafiadora do grupo: Audiências (42%)"
- "Evolução geral: intensidade média caiu de 7.2 para 6.1 no último mês"
- "Distribuição reativo vs. estratégico do grupo"

## API

- **Route:** `GET /api/dashboard/insights`
- **Auth:** Required (mentor only)
- **Query:** period=week|month

## Related

- **Agent:** mentor-dashboard
- **Stories:** Story 4.5 (Group Insights Panel)
