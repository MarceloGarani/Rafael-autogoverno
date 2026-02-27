# Tech Stack — Diário de Autogoverno

## Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (base components)
- **Charts:** Recharts
- **State:** Zustand (global), React Query (server state)
- **Font:** Inter or Geist (via next/font)
- **PWA:** next-pwa

## Backend
- **API:** Next.js API Routes (server-side)
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (email/password, magic link)
- **AI:** Anthropic Claude API (@anthropic-ai/sdk)
- **Email:** Resend
- **Scheduled Jobs:** Vercel Cron Jobs

## Infrastructure
- **Deploy:** Vercel (auto-deploy via Git)
- **Database hosting:** Supabase (managed PostgreSQL)
- **CI/CD:** Vercel + GitHub Actions

## Design
- **Theme:** Dark mode default
- **Colors:** Black (#000000), Red (#E53935), White (#FFFFFF)
- **Mentee UI:** Mobile-first
- **Mentor UI:** Desktop-first (sidebar layout)

## Testing
- **Unit:** Jest + React Testing Library
- **Integration:** Jest (API routes)
- **E2E:** Playwright (post-MVP)
- **Coverage target:** 80%+ business logic
