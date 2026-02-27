---
task: Generate AI Reflection
responsavel: "@ai-reflection"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - entry_id: UUID do registro que origina a reflexão
  - entry_data: { situation, category, emotion, intensity, reaction, self_perception }
  - user_history: Últimos 5-10 registros do mentorado (opcional, para detecção de padrões)
Saida: |
  - questions[]: Array de 2-3 perguntas reflexivas personalizadas
  - reflection_id: UUID da reflexão criada
Checklist:
  - "[ ] Montar system prompt com Código A.D.V."
  - "[ ] Incluir dados do registro no user prompt"
  - "[ ] Incluir histórico recente (se disponível) para detectar padrões"
  - "[ ] Chamar Claude API server-side"
  - "[ ] Validar que resposta contém 2-3 perguntas"
  - "[ ] Persistir no Supabase (tabela ai_reflections)"
  - "[ ] Retornar questions e reflection_id"
  - "[ ] Graceful fallback se API falhar (salvar registro sem reflexão)"
---

# *generate-reflection

Gera 2-3 perguntas reflexivas personalizadas via Claude API após um registro diário.

## System Prompt

```
Você é o assistente do método Código A.D.V. do Dr. Rafael Coelho.
Seu papel é fazer perguntas reflexivas para advogados que registraram
situações de pressão emocional. Você NÃO é coach, NÃO é terapeuta.
Você fala como alguém que viveu a pressão da advocacia e sabe que
autogoverno se constrói com verdade e direção.

Tom: direto, firme, provocativo. Sem motivação rasa. Sem acolhimento
excessivo. Como um mentor que respeita o mentorado o suficiente para
ser honesto.

Framework A.D.V.:
- Autogoverno: capacidade de se regular emocionalmente antes de agir
- Direção: clareza sobre quem você quer ser e agir alinhado a isso
- Verdade: coragem de enxergar os próprios padrões sem romantizar

Gere exatamente 2-3 perguntas reflexivas baseadas no registro abaixo.
As perguntas devem provocar autoexame real, não conforto.
```

## Example Output

```json
{
  "questions": [
    "Você percebeu que essa é a terceira vez este mês que a ansiedade toma conta antes de audiências? O que você ainda não enfrentou sobre isso?",
    "Reagir com raiva numa negociação não é firmeza. É descontrole disfarçado. Qual seria a resposta de alguém com autogoverno nessa mesma situação?",
    "Cobrar é parte da advocacia. Se você sente culpa ao cobrar, o problema não é a cobrança — é o que você acredita sobre merecimento. O que precisa mudar aí?"
  ]
}
```

## Error Handling

- Se Claude API retornar erro: salvar entry sem reflexão, exibir mensagem graceful
- Se resposta não contiver perguntas válidas: retry 1x, depois fallback
- Max latency: 3 segundos (exibir animação de processamento)

## API

- **Route:** `POST /api/reflections`
- **Auth:** Required
- **Body:** { entry_id }

## Related

- **Agent:** ai-reflection
- **Triggered by:** create-entry (entry-manager)
- **Stories:** Story 2.2 (AI Reflection Generation)
