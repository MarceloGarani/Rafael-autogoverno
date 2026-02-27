---
task: List Entries
responsavel: "@entry-manager"
responsavel_type: squad-agent
squad: diario-autogoverno
atomic_layer: task
elicit: false
Entrada: |
  - user_id: ID do usuário autenticado
  - filters:
    - period: last_week | last_month | custom (start_date, end_date)
    - category: Enum (opcional)
    - emotion: Enum (opcional)
  - pagination:
    - page: Integer (default 1)
    - limit: Integer (default 20)
Saida: |
  - entries[]: Array de registros (id, date, category, emotion, intensity, created_at)
  - total_count: Contagem total para paginação
Checklist:
  - "[ ] Aplicar filtros de período"
  - "[ ] Aplicar filtros de categoria e emoção (se fornecidos)"
  - "[ ] Ordenar por data DESC (mais recente primeiro)"
  - "[ ] Aplicar paginação"
  - "[ ] Retornar dados resumidos (não incluir textos completos na lista)"
  - "[ ] RLS garante isolamento por user_id"
---

# *list-entries

Lista registros diários do mentorado com filtros e paginação.

## Display Format

Cada registro como card com:
- Data (formatada em português)
- Categoria (chip colorido)
- Emoção (ícone)
- Intensidade (indicador visual 1-10)

## API

- **Route:** `GET /api/entries`
- **Query Params:** period, category, emotion, page, limit
- **Auth:** Required
- **RLS:** Filtra automaticamente por user_id

## Empty State

Se não há registros, exibir mensagem orientativa e CTA para primeiro registro.

## Related

- **Agent:** entry-manager
- **Stories:** Story 2.3 (Entry History & Details)
