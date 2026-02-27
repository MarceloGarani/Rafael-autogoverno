# Source Tree — Diário de Autogoverno

```
packages/web/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (login, register)
│   │   ├── login/
│   │   └── register/
│   ├── (mentee)/                 # Mentee routes
│   │   ├── page.tsx              # Home (greeting, CTA, streak)
│   │   ├── entry/
│   │   │   ├── new/              # Daily entry stepper (3 steps)
│   │   │   └── [id]/
│   │   │       └── reflection/   # AI reflection post-entry
│   │   ├── history/              # Entry history with filters
│   │   ├── progress/             # Evolution charts & badges
│   │   └── reports/
│   │       ├── page.tsx          # Report list
│   │       └── weekly/[id]/      # Weekly report detail
│   ├── (mentor)/                 # Mentor routes (role-gated)
│   │   └── dashboard/
│   │       ├── page.tsx          # Overview (cards, alerts)
│   │       ├── mentees/
│   │       │   ├── page.tsx      # Mentee list with status
│   │       │   └── [id]/         # Mentee profile (tabs)
│   │       ├── insights/         # Group insights panel
│   │       └── diary/            # Mentor's personal diary (switch)
│   ├── api/                      # API Routes (server-side)
│   │   ├── entries/              # CRUD daily entries
│   │   ├── reflections/          # AI reflection generation
│   │   ├── reports/              # Weekly report generation
│   │   ├── briefings/            # Pre-session briefing
│   │   ├── dashboard/            # Mentor dashboard data
│   │   ├── mentor-notes/         # Mentor notes CRUD
│   │   ├── progress/             # Evolution data
│   │   └── reminders/            # Email reminder trigger
│   └── layout.tsx                # Root layout (dark mode, font)
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── entry/                    # Entry stepper, category chips, emotion picker
│   ├── reflection/               # AI reflection display, answer fields
│   ├── dashboard/                # Mentor dashboard components
│   ├── charts/                   # Recharts wrappers
│   ├── navigation/               # Bottom nav (mentee), sidebar (mentor)
│   └── shared/                   # Streak counter, badges, loading states
├── lib/
│   ├── supabase/                 # Supabase client (server/client)
│   ├── ai/                       # Claude API integration
│   ├── utils/                    # Helpers (dates, formatting)
│   └── validators/               # Entry validation schemas
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
└── stores/                       # Zustand stores
```
