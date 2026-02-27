---
task: Manage Mentor Notes
responsavel: "@mentee-profile"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentor_id: ID do mentor
  - mentee_id: ID do mentorado
  - content: Texto das notas (para PUT)
Saida: |
  - note_id: UUID da nota
  - updated_at: Timestamp da última atualização
Checklist:
  - "[ ] GET: Buscar nota existente do mentor para este mentorado"
  - "[ ] PUT: Criar ou atualizar nota (upsert)"
  - "[ ] Implementar autosave (debounce no frontend)"
  - "[ ] RLS: apenas o mentor pode ler/escrever suas notas"
---

# *manage-notes

Gerencia o bloco de notas do mentor por mentorado. Campo de texto persistente com autosave.

## Purpose

Rafael anota observações para usar nas sessões de mentoria.

## Example

"Abordar o padrão de culpa na cobrança — apareceu 3x nas últimas 2 semanas. Perguntar sobre a relação com merecimento."

## API

- **Route:** `GET/PUT /api/mentor-notes/{menteeId}`
- **Auth:** Required (mentor only)

## Frontend

- Textarea ou rich text básico
- Autosave com debounce (500ms)
- Indicador visual "Salvo" / "Salvando..."

## Related

- **Agent:** mentee-profile
- **Stories:** Story 3.3
