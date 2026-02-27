---
task: Create Daily Entry
responsavel: "@entry-manager"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - user_id: ID do usuário autenticado
  - situation: Texto livre descrevendo a situação (min 10 chars)
  - category: Enum (audiencia|negociacao|cliente|cobranca|equipe|decisao|outro)
  - emotion: Enum (ansiedade|raiva|medo|frustracao|inseguranca|culpa|outro)
  - intensity: Integer 1-10
  - reaction: Texto livre descrevendo a reação (min 10 chars)
  - self_perception: Enum (reactive|strategic|unsure)
Saida: |
  - entry_id: UUID do registro criado
  - status: "created"
  - created_at: Timestamp
Checklist:
  - "[ ] Validar todos os campos obrigatórios"
  - "[ ] Validar enums (category, emotion, self_perception)"
  - "[ ] Validar tamanho mínimo de texto (situation >= 10, reaction >= 10)"
  - "[ ] Validar intensidade (1-10)"
  - "[ ] Persistir no Supabase (tabela daily_entries)"
  - "[ ] Retornar entry_id para trigger de reflexão IA"
  - "[ ] Acionar engagement agent (calculate-streak, check-badges)"
---

# *create-entry

Cria um novo registro diário no Diário de Autogoverno.

## Stepper Flow (UX)

### Step 1: "O que aconteceu?"
- Campo de texto livre (placeholder: "Descreva a situação de pressão, conflito ou decisão que enfrentou hoje")
- Chips clicáveis de categoria: Audiência, Negociação, Cliente, Cobrança, Equipe, Decisão, Outro

### Step 2: "O que você sentiu?"
- Seleção de emoção com ícones visuais: Ansiedade, Raiva, Medo, Frustração, Insegurança, Culpa, Outro
- Slider de intensidade 1-10 com feedback visual de cor (verde → amarelo → vermelho)

### Step 3: "Como você reagiu?"
- Campo de texto livre (placeholder: "O que você fez ou disse?")
- Seleção rápida de autopercepção: Reativa | Estratégica | Não sei

## Validation Rules

| Field | Rule |
|-------|------|
| situation | obrigatório, string, min 10 chars |
| category | obrigatório, enum |
| emotion | obrigatório, enum |
| intensity | obrigatório, integer 1-10 |
| reaction | obrigatório, string, min 10 chars |
| self_perception | obrigatório, enum |

## API

- **Route:** `POST /api/entries`
- **Auth:** Required (Supabase Auth)
- **RLS:** user_id = auth.uid()

## Post-Create Triggers

1. Acionar `generate-reflection` (ai-reflection agent) com entry_id
2. Acionar `calculate-streak` (engagement agent) com user_id
3. Acionar `check-badges` (engagement agent) com user_id

## Related

- **Agent:** entry-manager
- **Next:** generate-reflection (ai-reflection)
- **Stories:** Story 2.1 (Daily Entry Stepper)
