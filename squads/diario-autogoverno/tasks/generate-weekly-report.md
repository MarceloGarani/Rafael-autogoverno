---
task: Generate Weekly Report
responsavel: "@ai-reflection"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - user_id: ID do usuário
  - week_start: Data início da semana
  - week_end: Data fim da semana
  - entries[]: Registros da semana
Saida: |
  - report: { summary, patterns, evolution, insight, challenge }
  - report_id: UUID do relatório
Checklist:
  - "[ ] Agregar registros da semana"
  - "[ ] Montar system prompt analítico do A.D.V."
  - "[ ] Chamar Claude API com dados da semana"
  - "[ ] Extrair seções: resumo, padrões, evolução, insight, desafio"
  - "[ ] Persistir no Supabase (tabela weekly_reports)"
  - "[ ] Se < 3 registros na semana, gerar relatório simplificado"
---

# *generate-weekly-report

Gera relatório semanal automático com IA analisando todos os registros da semana.

## System Prompt

```
Você é o assistente analítico do método Código A.D.V. Analise os
registros da semana e gere um relatório estruturado. Identifique
padrões, conecte com o framework A.D.V., e sugira um desafio prático
para a próxima semana. Seja específico — use os dados reais do
mentorado. Não generalize.
```

## Report Sections

1. **Resumo da semana:** Quantos registros, categorias frequentes, emoções predominantes
2. **Padrões identificados:** Ex: "Ansiedade em 4 de 5 dias, 3 relacionados a audiências"
3. **Evolução:** Comparativo com semana anterior (intensidade média, reativo vs. estratégico)
4. **Insight da semana:** Reflexão profunda conectada ao A.D.V.
5. **Desafio da próxima semana:** Micro-prática sugerida

## Scheduling

- **Trigger:** Vercel Cron Job (domingo à noite ou configurável)
- **Route:** `POST /api/reports/weekly`

## Edge Case

Se mentorado tem < 3 registros: relatório simplificado com nota sobre consistência.

## Related

- **Agent:** ai-reflection
- **Stories:** Story 4.1 (Weekly Report Generation)
