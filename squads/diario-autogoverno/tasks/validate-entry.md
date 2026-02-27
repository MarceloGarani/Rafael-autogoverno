---
task: Validate Entry Data
responsavel: "@entry-manager"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - entry_data: Objeto com campos do registro para validação
Saida: |
  - validation_result: boolean (true se válido)
  - errors[]: Array de erros (field, message) se inválido
Checklist:
  - "[ ] Validar presence de campos obrigatórios"
  - "[ ] Validar situation length >= 10"
  - "[ ] Validar category in enum"
  - "[ ] Validar emotion in enum"
  - "[ ] Validar intensity between 1 and 10"
  - "[ ] Validar reaction length >= 10"
  - "[ ] Validar self_perception in enum"
  - "[ ] Retornar lista de erros com mensagens em português"
---

# *validate-entry

Valida dados de entrada antes de persistir. Executado client-side (feedback imediato) e server-side (segurança).

## Validation Schema

| Field | Type | Required | Rules | Error Message |
|-------|------|----------|-------|---------------|
| situation | string | yes | min 10 chars | "Descreva a situação com pelo menos 10 caracteres" |
| category | enum | yes | in list | "Selecione uma categoria" |
| emotion | enum | yes | in list | "Selecione uma emoção" |
| intensity | number | yes | 1-10, integer | "Intensidade deve ser entre 1 e 10" |
| reaction | string | yes | min 10 chars | "Descreva sua reação com pelo menos 10 caracteres" |
| self_perception | enum | yes | in list | "Selecione sua autopercepção" |

## Implementation

Usar Zod schema para validação type-safe compartilhada entre client e server.

## Related

- **Agent:** entry-manager
- **Used by:** create-entry (pre-persist validation)
