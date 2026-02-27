---
task: Get Entry Details
responsavel: "@entry-manager"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - entry_id: UUID do registro
  - user_id: ID do usuário autenticado (para RLS)
Saida: |
  - entry: Objeto completo com todos os campos
    - id, date, situation, category, emotion, intensity, reaction, self_perception, created_at
    - ai_reflection: { questions[], answers[] } (se existir)
Checklist:
  - "[ ] Buscar entry por ID"
  - "[ ] Incluir ai_reflection relacionada (JOIN)"
  - "[ ] Incluir respostas do mentorado (se existirem)"
  - "[ ] RLS garante que apenas o próprio usuário ou mentor acessa"
  - "[ ] Retornar 404 se não encontrado"
---

# *get-entry

Obtém detalhes completos de um registro diário, incluindo perguntas da IA e respostas do mentorado.

## Data Includes

- Todos os campos do registro
- Perguntas reflexivas da IA (ai_reflections.questions)
- Respostas do mentorado (ai_reflections.answers, pode ser null)

## Access Control

- **Mentorado:** Acessa apenas seus próprios registros
- **Mentor:** Acessa registros de qualquer mentorado (via dashboard)

## API

- **Route:** `GET /api/entries/{id}`
- **Auth:** Required
- **RLS:** user_id = auth.uid() OR role = mentor

## Related

- **Agent:** entry-manager
- **Stories:** Story 2.3 (Entry History & Details)
