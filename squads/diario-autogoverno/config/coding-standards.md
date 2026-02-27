# Coding Standards — Diário de Autogoverno

Extends: AIOS core coding standards

## Language & Framework

- TypeScript strict mode
- Next.js 14+ App Router (Server Components by default, Client Components only when needed)
- Tailwind CSS for styling (no CSS modules)
- Absolute imports with `@/` alias

## Conventions

- Portuguese for user-facing strings and comments related to business logic
- English for code identifiers (variables, functions, types, components)
- Conventional commits with story reference: `feat: implement login [Story 1.1]`

## Component Patterns

- Server Components by default
- `"use client"` only for interactive components (forms, sliders, toggles)
- Colocate components with their routes when page-specific
- Shared components in `components/`

## API Routes

- All AI calls server-side only (never expose API keys to client)
- Use Supabase client with RLS for data access
- Return typed responses with proper error codes

## Data Access

- Supabase client via `@supabase/ssr` for server components
- RLS policies enforce data isolation — no manual user_id filtering in queries
- Mentor queries must explicitly exclude own records from dashboard endpoints
