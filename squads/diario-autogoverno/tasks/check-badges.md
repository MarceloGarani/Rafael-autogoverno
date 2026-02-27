---
task: Check and Award Badges
responsavel: "@engagement"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - user_id: ID do usuário
  - current_streak: Streak atual (integer)
  - total_entries: Total de registros do usuário
Saida: |
  - new_badges[]: Badges recém-conquistados ({ badge_type, earned_at })
  - all_badges[]: Todos os badges do usuário ({ badge_type, earned_at })
Checklist:
  - "[ ] Verificar condições de cada badge"
  - "[ ] Não conceder badge já conquistado"
  - "[ ] Persistir novos badges no Supabase (tabela badges)"
  - "[ ] Retornar novos badges para notificação in-app"
---

# *check-badges

Verifica e concede badges de consistência ao mentorado.

## Badge Types

| Badge | Condition | Icon |
|-------|-----------|------|
| `7-dias` (Primeira Semana) | 7 dias consecutivos | 🏅 |
| `30-dias` (Primeiro Mês) | 30 dias consecutivos | 🥇 |
| `semana-perfeita` (Semana Perfeita) | 7/7 dias na semana | ⭐ |
| `mestre-autogoverno` (Mestre do Autogoverno) | 90 dias consecutivos | 👑 |

## Logic

```
for each badge_type:
  if condition_met AND not already_earned:
    award badge
    add to new_badges[]
```

## Triggered By

- Após cada `create-entry` (entry-manager), junto com calculate-streak

## API

- **Route:** `GET /api/progress/badges`
- **Auth:** Required

## Related

- **Agent:** engagement
- **Stories:** Story 5.1 (Streak & Badge System)
