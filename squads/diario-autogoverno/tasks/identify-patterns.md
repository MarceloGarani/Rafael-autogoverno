---
task: Identify Emotional Patterns
responsavel: "@ai-reflection"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - user_id: ID do mentorado
  - entries[]: Histórico completo de registros
Saida: |
  - patterns[]: Array de padrões identificados
    - description: Descrição do padrão
    - confidence: Nível de confiança (0-1)
    - connected_adv_pillar: Pilar A.D.V. relacionado (autogoverno|direcao|verdade)
Checklist:
  - "[ ] Buscar histórico completo do mentorado"
  - "[ ] Analisar frequência de categorias + emoções"
  - "[ ] Identificar correlações (ex: audiência + ansiedade + intensidade alta)"
  - "[ ] Chamar Claude API para análise qualitativa"
  - "[ ] Conectar cada padrão a um pilar do A.D.V."
  - "[ ] Retornar com confidence score"
---

# *identify-patterns

Identifica padrões emocionais recorrentes no histórico completo do mentorado.

## Pattern Examples

- "Ansiedade recorrente em audiências — 80% dos registros dessa categoria têm intensidade 8+"
- "Padrão de culpa em situações de cobrança — 3 ocorrências nas últimas 2 semanas"
- "Evolução positiva: reações estratégicas aumentaram de 20% para 45% no último mês"

## Display

Exibido na aba "Padrões IA" do perfil do mentorado no dashboard do mentor.

## API

- **Route:** `GET /api/mentees/{id}/patterns`
- **Auth:** Required (mentor only for dashboard view, mentee for own patterns)

## Related

- **Agent:** ai-reflection
- **Stories:** Story 4.3 (Mentor — Evolution & Pattern Tabs)
