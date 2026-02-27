---
task: Mentee Weekly Reports
responsavel: "@mentee-profile"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentee_id: ID do mentorado
Saida: |
  - weekly_reports[]: { id, week_start, week_end, summary_preview }
Checklist:
  - "[ ] Buscar todos os relatórios semanais do mentorado"
  - "[ ] Ordenar por week_start DESC"
  - "[ ] Incluir preview do resumo (primeiros 100 chars)"
---

# *mentee-reports

Lista relatórios semanais do mentorado. O mentor pode abrir e ler cada um.

## API

- **Route:** `GET /api/dashboard/mentees/{id}/reports`
- **Auth:** Required (mentor only, or own user)

## Related

- **Agent:** mentee-profile
- **Stories:** Story 4.3
