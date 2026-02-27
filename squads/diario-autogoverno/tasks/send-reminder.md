---
task: Send Daily Reminders
responsavel: "@engagement"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - users_without_entry_today[]: Array de usuários que não registraram hoje
    - user_id, name, email
Saida: |
  - sent_count: Quantidade de emails enviados
  - failed[]: Array de falhas ({ user_id, error })
Checklist:
  - "[ ] Buscar mentorados que não registraram hoje"
  - "[ ] Excluir mentorados que desativaram lembretes"
  - "[ ] Enviar email via Resend para cada um"
  - "[ ] Registrar resultado (sucesso/falha)"
  - "[ ] Template de email com branding (dark mode)"
---

# *send-reminder

Envia lembretes diários por email para mentorados que ainda não registraram.

## Schedule

- **Trigger:** Vercel Cron Job diário às 20h (configurável)
- **Route:** `POST /api/reminders` (called by cron)

## Email Content

- **Subject:** "Como foi seu dia na advocacia?"
- **Body:** Mensagem breve no tom do Rafael + link direto para formulário de registro
- **Template:** Alinhado com branding (dark mode, cores, tom direto)

## Rules

- Não enviar para quem já registrou no dia
- Não enviar para quem desativou lembretes (configuração do mentorado)
- Provider: Resend (free tier generoso, integração Vercel)

## API

- **Route:** `POST /api/reminders`
- **Auth:** Cron secret (não precisa de auth de usuário)

## Related

- **Agent:** engagement
- **Stories:** Story 5.2 (Email Reminders)
