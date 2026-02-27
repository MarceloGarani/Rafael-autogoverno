---
task: Save Reflection Answers
responsavel: "@ai-reflection"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - reflection_id: UUID da reflexão
  - answers[]: Array de respostas (nullable — mentorado pode não responder)
Saida: |
  - updated_reflection: Reflexão atualizada com respostas
Checklist:
  - "[ ] Buscar reflexão por ID"
  - "[ ] Atualizar campo answers (JSON)"
  - "[ ] Permitir null/empty para perguntas não respondidas"
  - "[ ] Persistir no Supabase"
  - "[ ] RLS: apenas o próprio mentorado pode salvar"
---

# *save-reflection-answers

Salva as respostas do mentorado às perguntas reflexivas da IA. Respostas são opcionais — o mentorado pode responder todas, algumas ou nenhuma.

## API

- **Route:** `PUT /api/reflections/{id}`
- **Auth:** Required
- **Body:** { answers: string[] }

## Related

- **Agent:** ai-reflection
- **Stories:** Story 2.2
