---
task: Mentee Evolution Charts
responsavel: "@mentee-profile"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentee_id: ID do mentorado
  - period: month | 3months | all
Saida: |
  - intensity_timeline[]: { week, avg_intensity }
  - category_distribution[]: { category, count, percentage }
  - reactive_strategic_ratio[]: { month, reactive_pct, strategic_pct }
Checklist:
  - "[ ] Agregar intensidade média por semana"
  - "[ ] Contar distribuição de categorias"
  - "[ ] Calcular ratio reativo/estratégico por mês"
  - "[ ] Aplicar filtro de período"
---

# *mentee-evolution

Dados para gráficos de evolução emocional do mentorado.

## Charts (Recharts)

1. **Line chart:** Intensidade média por semana ao longo do tempo
2. **Pie/donut chart:** Distribuição de categorias
3. **Bar chart:** % reativo vs. estratégico por mês

## API

- **Route:** `GET /api/dashboard/mentees/{id}/evolution`
- **Auth:** Required (mentor only, or own user)
- **Query:** period=month|3months|all

## Related

- **Agent:** mentee-profile
- **Stories:** Story 4.2, Story 4.3
