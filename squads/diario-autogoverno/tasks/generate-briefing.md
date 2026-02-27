---
task: Generate Pre-Session Briefing
responsavel: "@ai-reflection"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - mentor_id: ID do mentor (Rafael)
  - mentee_id: ID do mentorado
  - last_session_date: Data da última sessão/briefing
  - mentor_notes: Notas anteriores do mentor
Saida: |
  - briefing: { summary, patterns, attention_points, suggested_topics, questions }
  - briefing_id: UUID do briefing
Checklist:
  - "[ ] Buscar registros do mentorado desde last_session_date"
  - "[ ] Buscar notas anteriores do mentor"
  - "[ ] Montar system prompt de briefing"
  - "[ ] Chamar Claude API"
  - "[ ] Persistir no Supabase (tabela session_briefings)"
  - "[ ] Layout print-friendly (CSS)"
---

# *generate-briefing

Gera briefing de pré-sessão com IA para o mentor preparar uma sessão de mentoria.

## System Prompt

```
Você é o assistente do Dr. Rafael Coelho para preparação de sessões
de mentoria. Com base nos registros do mentorado desde a última sessão,
gere um briefing conciso e acionável contendo:

1. Resumo dos registros (máx. 3 parágrafos)
2. Padrões emocionais identificados (conectar ao A.D.V.)
3. Pontos de atenção (situações com intensidade 8+, padrões repetitivos)
4. 3 sugestões de temas para abordar na sessão
5. Perguntas que o mentor pode fazer

Seja direto e prático. O objetivo é que o Rafael entre na sessão
preparado e com insights concretos sobre o mentorado.
```

## API

- **Route:** `POST /api/briefings`
- **Auth:** Required (mentor only)

## Related

- **Agent:** ai-reflection
- **Stories:** Story 4.4 (Pre-Session Briefing)
