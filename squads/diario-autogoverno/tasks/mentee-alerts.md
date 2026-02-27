---
task: Mentee Inactivity Alerts
responsavel: "@mentor-dashboard"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentor_id: ID do mentor
  - threshold_days: Dias de inatividade para alerta (default: 3)
Saida: |
  - alerts[]: Array de alertas
    - mentee_name: Nome do mentorado
    - days_inactive: Dias sem registro
    - last_entry_date: Data do último registro
Checklist:
  - "[ ] Calcular dias desde último registro de cada mentorado"
  - "[ ] Filtrar mentorados com dias >= threshold"
  - "[ ] Ordenar por dias_inactive DESC"
---

# *mentee-alerts

Gera lista de alertas de mentorados inativos para o dashboard do mentor.

## Display

- "⚠️ Ana não registra há 4 dias"
- "⚠️ Pedro não registra há 7 dias"

## API

- **Route:** `GET /api/dashboard/alerts`
- **Auth:** Required (mentor only)

## Related

- **Agent:** mentor-dashboard
- **Stories:** Story 3.1
