---
task: Progress Summary
responsavel: "@engagement"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - user_id: ID do usuário
  - period: month | 3months | all
Saida: |
  - streak_info: { current, longest }
  - badges[]: { type, earned_at }
  - intensity_trend: { direction (up|down|stable), magnitude }
  - reactive_ratio_trend: { direction, current_pct }
Checklist:
  - "[ ] Buscar streak atual e maior"
  - "[ ] Buscar todos os badges conquistados"
  - "[ ] Calcular tendência de intensidade no período"
  - "[ ] Calcular tendência de ratio reativo vs. estratégico"
  - "[ ] Aplicar filtro de período"
---

# *progress-summary

Resumo de progresso do mentorado para a tela "Meu Progresso".

## Display (Tela Meu Progresso)

- Streak atual e maior streak
- Badges conquistados com data
- Gráfico de linha: intensidade ao longo das semanas
- Gráfico de pizza: distribuição de categorias
- Indicador: % reativo vs. estratégico (evolução mensal)
- Total de registros

## API

- **Route:** `GET /api/progress`
- **Auth:** Required
- **Query:** period=month|3months|all

## Shared Components

Os mesmos componentes de gráfico (Recharts) são reutilizados em:
- Tela "Meu Progresso" do mentorado
- Aba "Evolução" no perfil do mentorado (dashboard do mentor)

## Related

- **Agent:** engagement
- **Uses:** calculate-streak, check-badges
- **Stories:** Story 4.2 (Evolution Charts), Story 5.1 (Streak & Badge)
