---
task: View Mentee Profile
responsavel: "@mentee-profile"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentor_id: ID do mentor
  - mentee_id: ID do mentorado
Saida: |
  - mentee_info: { name, email, start_date }
  - stats: { current_streak, longest_streak, total_entries }
Checklist:
  - "[ ] Buscar dados do mentorado"
  - "[ ] Calcular streak atual e maior streak"
  - "[ ] Contar total de registros"
  - "[ ] RLS: apenas mentor pode acessar"
---

# *view-profile

Exibe header do perfil do mentorado com dados básicos e estatísticas.

## API

- **Route:** `GET /api/dashboard/mentees/{id}`
- **Auth:** Required (mentor only)

## Related

- **Agent:** mentee-profile
- **Stories:** Story 3.3 (Mentee Profile)
