---
task: Calculate Streak
responsavel: "@engagement"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - user_id: ID do usuário
Saida: |
  - current_streak: Dias consecutivos de registro (integer)
  - longest_streak: Maior streak já atingido (integer)
  - last_entry_date: Data do último registro
Checklist:
  - "[ ] Buscar todas as datas de registro do usuário (ORDER BY date DESC)"
  - "[ ] Calcular dias consecutivos a partir de hoje"
  - "[ ] Calcular maior streak histórico"
  - "[ ] Retornar 0 se nunca registrou"
---

# *calculate-streak

Calcula o streak atual e o maior streak do mentorado.

## Logic

```
streak = 0
for each day going backwards from today:
  if user has entry on this day:
    streak++
  else:
    break
```

- Se registrou hoje: streak inclui hoje
- Se não registrou hoje mas registrou ontem: streak começa de ontem
- Se pulou um dia: streak reseta a 0

## Display

- Home do mentorado: "🔥 7 dias consecutivos"
- Tela de confirmação pós-registro: streak atualizado
- Dashboard do mentor: streak de cada mentorado na lista

## Triggered By

- Após cada `create-entry` (entry-manager)
- Ao carregar Home do mentorado
- Ao listar mentorados no dashboard

## API

- **Route:** `GET /api/progress/streak`
- **Auth:** Required

## Related

- **Agent:** engagement
- **Stories:** Story 5.1 (Streak & Badge System), Story 1.5 (Mentee Home)
