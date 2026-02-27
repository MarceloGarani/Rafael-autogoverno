---
task: List Mentees
responsavel: "@mentor-dashboard"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentor_id: ID do mentor
  - filters:
    - status: active | absent | inactive (opcional)
    - search_query: Busca por nome (opcional)
Saida: |
  - mentees[]: Array de mentorados
    - id, name, avatar_initials, last_entry_date, current_streak, avg_intensity_week, status
Checklist:
  - "[ ] Buscar todos os mentorados (role = mentee)"
  - "[ ] Calcular status de cada um (🟢 ≤2d, 🟡 3-5d, 🔴 5+d)"
  - "[ ] Calcular streak atual e intensidade média semanal"
  - "[ ] Aplicar filtros de status e busca por nome"
  - "[ ] Ordenar: inativos primeiro (maior urgência)"
---

# *list-mentees

Lista todos os mentorados com status visual, streak e intensidade média.

## Status Visual

| Status | Condition | Display |
|--------|-----------|---------|
| Ativo | Registrou nos últimos 2 dias | 🟢 |
| Ausente | 3-5 dias sem registro | 🟡 |
| Inativo | 5+ dias sem registro | 🔴 |

## API

- **Route:** `GET /api/dashboard/mentees`
- **Auth:** Required (mentor only)

## Related

- **Agent:** mentor-dashboard
- **Stories:** Story 3.2 (Mentee List & Status)
