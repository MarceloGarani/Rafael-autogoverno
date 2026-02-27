# Wireframes — Diario de Autogoverno — MVP Phase 1

> **Design System:** Dark mode default | Palette: Black `#000`, Red `#E53935`, White `#FFF`
> **Font:** Inter (sans-serif) | **Mentee:** Mobile-first (max-w ~400px) | **Mentor:** Desktop-first (sidebar 240px + content)

---

## Table of Contents

1. [Login](#1-login)
2. [Register (Invite-Only)](#2-register-invite-only)
3. [Mentee Home](#3-mentee-home)
4. [Entry Step 1 — "O que aconteceu?"](#4-entry-step-1--o-que-aconteceu)
5. [Entry Step 2 — "O que voce sentiu?"](#5-entry-step-2--o-que-voce-sentiu)
6. [Entry Step 3 — "Como voce reagiu?"](#6-entry-step-3--como-voce-reagiu)
7. [AI Reflection](#7-ai-reflection)
8. [Confirmation](#8-confirmation)
9. [History / Timeline](#9-history--timeline)
10. [Mentor Dashboard Overview](#10-mentor-dashboard-overview)
11. [Mentee List](#11-mentee-list)
12. [Mentor "Meu Diario" (Switch Mode)](#12-mentor-meu-diario-switch-mode)

---

## 1. Login

**Route:** `/login`
**Layout:** mobile-first (centered 400px container)
**Responsive:** Remains centered on desktop; container does not stretch beyond 400px.

### Wireframe

```
┌──────────────────────────────────────────┐
│              #000 Background             │
│                                          │
│     ┌──────────────────────────────┐     │
│     │                              │     │
│     │     DIARIO DE AUTOGOVERNO    │     │
│     │        ─── Logo ───          │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │ Email                │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │ Senha                │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │      ENTRAR          │    │     │
│     │  │   (#E53935 bg)       │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  Primeiro acesso? Usar       │     │
│     │  convite (link → /register)  │     │
│     │                              │     │
│     └──────────────────────────────┘     │
│             max-w: 400px                 │
└──────────────────────────────────────────┘
```

### Component Map

- `Heading` → App name / logo at top
- `Input` (email) → Email field with placeholder "seu@email.com"
- `Input` (password) → Password field with type="password"
- `Button` (primary, red) → "Entrar" — full-width, bg `#E53935`, text white
- `Text` (link) → "Primeiro acesso? Usar convite" — links to `/register`

### Data Model Mapping

- Email field → Supabase Auth `email`
- Password field → Supabase Auth `password`

### Responsive Behavior

- Mobile: Container fills viewport width with 16px horizontal padding
- Desktop: Container is 400px centered horizontally and vertically

### Interactions

- Click "Entrar" → Authenticate via Supabase Auth → redirect to `/` (mentee home) or `/mentor` (mentor dashboard) based on `User.role`
- Click "Primeiro acesso? Usar convite" → Navigate to `/register`
- Invalid credentials → Inline error message below password field in `#E53935`

---

## 2. Register (Invite-Only)

**Route:** `/register`
**Layout:** mobile-first (centered 400px container)
**Responsive:** Same centering behavior as Login.

### Wireframe

```
┌──────────────────────────────────────────┐
│              #000 Background             │
│                                          │
│     ┌──────────────────────────────┐     │
│     │                              │     │
│     │     DIARIO DE AUTOGOVERNO    │     │
│     │       Criar sua conta        │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │ Codigo de convite    │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │ Nome completo        │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │ Email                │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │ Senha                │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  ┌──────────────────────┐    │     │
│     │  │    CRIAR CONTA       │    │     │
│     │  │   (#E53935 bg)       │    │     │
│     │  └──────────────────────┘    │     │
│     │                              │     │
│     │  Ja tem conta? Entrar        │     │
│     │  (link → /login)             │     │
│     │                              │     │
│     └──────────────────────────────┘     │
│             max-w: 400px                 │
└──────────────────────────────────────────┘
```

### Component Map

- `Heading` → App name + "Criar sua conta" subtitle
- `Input` (invite code) → "Codigo de convite" — validated server-side
- `Input` (name) → "Nome completo"
- `Input` (email) → "Email"
- `Input` (password) → "Senha" — type="password"
- `Button` (primary, red) → "Criar conta" — full-width
- `Text` (link) → "Ja tem conta? Entrar" — links to `/login`

### Data Model Mapping

- Invite code → Validated against invite table (not in core models, but required for gating)
- Name → `User.name`
- Email → `User.email` / Supabase Auth `email`
- Password → Supabase Auth `password`
- Role → Auto-set to `mentee` on registration

### Responsive Behavior

- Mobile: Full-width with 16px padding
- Desktop: 400px centered container

### Interactions

- Click "Criar conta" → Validate invite code → Create Supabase Auth user → Insert `User` record → Redirect to `/`
- Invalid invite code → Inline error below invite field
- Click "Ja tem conta? Entrar" → Navigate to `/login`

---

## 3. Mentee Home

**Route:** `/`
**Layout:** mobile-first (single-column, max-w ~400px)
**Responsive:** On desktop, content stays centered in a narrow column; bottom nav becomes top nav or sidebar.

### Wireframe

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│  Boa noite, Marcelo.           │
│  Como foi seu dia?             │
│                                │
│  ┌────────────────────────┐    │
│  │  🔥 12 dias             │    │
│  │  ● ● ● ● ○ ● ●        │    │
│  │  seg ter qua qui sex   │    │
│  │          sab dom        │    │
│  └────────────────────────┘    │
│                                │
│  ┌────────────────────────┐    │
│  │                        │    │
│  │    REGISTRAR O DIA     │    │
│  │     (#E53935 bg)       │    │
│  │     (full-width)       │    │
│  │                        │    │
│  └────────────────────────┘    │
│                                │
│  Resumo da semana              │
│  ┌────────────────────────┐    │
│  │  ▂ ▅ ▃ ▇ _ ▄ ▆        │    │
│  │  S  T  Q  Q  S  S  D  │    │
│  │  (intensity per day)   │    │
│  └────────────────────────┘    │
│                                │
│                                │
├────────────────────────────────┤
│  🏠 Home  │ 📋 Historico │ 👤  │
│  (active) │              │Perfil│
└────────────────────────────────┘
```

### Component Map

- `Heading` → Contextual greeting ("Bom dia / Boa tarde / Boa noite, [Nome]")
- `Text` → Subtitle "Como foi seu dia?"
- `StreakCounter` → Fire icon + "X dias" + mini calendar dots (filled = entry exists)
- `Button` (primary, red, large) → "Registrar o dia" — full-width CTA
- `WeeklySummaryBar` → 7 vertical bars showing intensity per day of current week (height proportional to max intensity that day, color from green to red)
- `BottomNav` → 3 tabs: Home (active), Historico, Perfil

### Data Model Mapping

- Greeting name → `User.name`
- Streak count → Computed from consecutive `DailyEntry.date` records
- Calendar dots → `DailyEntry` existence per day of current week
- Weekly bars → `DailyEntry.intensity` per day of current week

### Responsive Behavior

- Mobile: Single column, bottom nav fixed at viewport bottom
- Desktop: Content centered max-w 400px, bottom nav replaced by horizontal top nav or hidden (mentee rarely uses desktop)

### Interactions

- Click "Registrar o dia" → Navigate to `/entry/step-1`
- Click "Historico" (bottom nav) → Navigate to `/history`
- Click "Perfil" (bottom nav) → Navigate to `/profile`
- If entry already exists for today → CTA changes to "Editar registro de hoje"

---

## 4. Entry Step 1 — "O que aconteceu?"

**Route:** `/entry/step-1`
**Layout:** mobile-first (max-w ~400px)
**Responsive:** Centered narrow column on desktop.

### Wireframe

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│  ┌────────────────────────┐    │
│  │ ████████░░░░░░░░░░░░░░ │    │
│  │  Step 1 de 3            │    │
│  └────────────────────────┘    │
│                                │
│  O que aconteceu hoje?         │
│                                │
│  ┌────────────────────────┐    │
│  │                        │    │
│  │  Descreva a situacao   │    │
│  │  de pressao, conflito  │    │
│  │  ou decisao...         │    │
│  │                        │    │
│  └────────────────────────┘    │
│  (textarea, 4-5 rows)         │
│                                │
│  Categoria:                    │
│  ┌─────────┐ ┌───────────┐    │
│  │Audiencia│ │Negociacao │    │
│  └─────────┘ └───────────┘    │
│  ┌─────────┐ ┌───────────┐    │
│  │ Cliente │ │ Cobranca  │    │
│  └─────────┘ └───────────┘    │
│  ┌─────────┐ ┌───────────┐    │
│  │ Equipe  │ │ Decisao   │    │
│  └─────────┘ └───────────┘    │
│  ┌─────────┐                   │
│  │  Outro  │                   │
│  └─────────┘                   │
│                                │
│  ┌────────────────────────┐    │
│  │       PROXIMO          │    │
│  │     (#E53935 bg)       │    │
│  └────────────────────────┘    │
│                                │
└────────────────────────────────┘
```

### Component Map

- `ProgressBar` → 1/3 filled, red `#E53935` fill on dark track
- `Heading` → "O que aconteceu hoje?"
- `Textarea` → 4-5 rows, dark bg `#111`, border `#333`, white text, placeholder in `#666`
- `CategoryChips` → Wrap layout, 7 chips. Unselected: border `#333`, text `#AAA`. Selected: bg `#E53935`, text white. Single-select.
- `Button` (primary) → "Proximo" — disabled until textarea has content and category is selected

### Data Model Mapping

- Textarea → `DailyEntry.situation`
- Selected category → `DailyEntry.category` (enum: Audiencia, Negociacao, Cliente, Cobranca, Equipe, Decisao, Outro)

### Responsive Behavior

- Mobile: Full-width with padding, chips wrap to 2 per row
- Desktop: 400px centered, chips can fit 3-4 per row

### Interactions

- Type in textarea → Enable "Proximo" button (min 10 characters)
- Tap chip → Select category (single-select, toggleable)
- Click "Proximo" → Navigate to `/entry/step-2`, carry state forward
- Swipe back / browser back → Confirm discard or save draft

---

## 5. Entry Step 2 — "O que voce sentiu?"

**Route:** `/entry/step-2`
**Layout:** mobile-first (max-w ~400px)
**Responsive:** Centered narrow column on desktop.

### Wireframe

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│  ┌────────────────────────┐    │
│  │ ████████████████░░░░░░ │    │
│  │  Step 2 de 3            │    │
│  └────────────────────────┘    │
│                                │
│  O que voce sentiu?            │
│                                │
│  ┌────────┐ ┌────────┐        │
│  │  😰    │ │  😡    │        │
│  │Ansiedade│ │ Raiva  │        │
│  └────────┘ └────────┘        │
│  ┌────────┐ ┌────────┐        │
│  │  😨    │ │  😤    │        │
│  │ Medo   │ │Frustra-│        │
│  │        │ │  cao   │        │
│  └────────┘ └────────┘        │
│  ┌────────┐ ┌────────┐        │
│  │  😟    │ │  😔    │        │
│  │Insegu- │ │ Culpa  │        │
│  │ ranca  │ │        │        │
│  └────────┘ └────────┘        │
│  ┌────────┐                    │
│  │  ❓    │                    │
│  │ Outro  │                    │
│  └────────┘                    │
│                                │
│  Intensidade                   │
│  ┌────────────────────────┐    │
│  │ 1 ───●──────────── 10  │    │
│  │   🟢  🟡  🟠  🔴       │    │
│  │      Valor: [ 4 ]      │    │
│  └────────────────────────┘    │
│  (gradient: green→yellow→red)  │
│                                │
│  ┌──────────┐ ┌───────────┐   │
│  │  VOLTAR  │ │  PROXIMO  │   │
│  │  (ghost) │ │ (#E53935) │   │
│  └──────────┘ └───────────┘   │
│                                │
└────────────────────────────────┘
```

### Component Map

- `ProgressBar` → 2/3 filled
- `Heading` → "O que voce sentiu?"
- `EmotionPicker` → Grid of 7 emotion cards (icon + label). Unselected: border `#333`, text `#AAA`. Selected: border `#E53935`, bg `#1A0000`. Single-select.
- `IntensitySlider` → Range input 1-10. Track has CSS gradient `green (#4CAF50) → yellow (#FFC107) → red (#E53935)`. Thumb is white circle. Current value shown in badge to the right.
- `Button` (ghost) → "Voltar" — transparent bg, border `#333`, text white
- `Button` (primary) → "Proximo" — disabled until emotion is selected

### Data Model Mapping

- Selected emotion → `DailyEntry.emotion` (enum: Ansiedade, Raiva, Medo, Frustracao, Inseguranca, Culpa, Outro)
- Slider value → `DailyEntry.intensity` (integer 1-10)

### Responsive Behavior

- Mobile: Emotion grid 2 columns, slider full-width
- Desktop: Emotion grid can expand to 3-4 columns, slider centered

### Interactions

- Tap emotion card → Select (single-select, visual highlight with red border)
- Drag slider → Update intensity value badge in real-time
- Click "Voltar" → Navigate back to `/entry/step-1` preserving state
- Click "Proximo" → Navigate to `/entry/step-3`

---

## 6. Entry Step 3 — "Como voce reagiu?"

**Route:** `/entry/step-3`
**Layout:** mobile-first (max-w ~400px)
**Responsive:** Centered narrow column on desktop.

### Wireframe

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│  ┌────────────────────────┐    │
│  │ ████████████████████████│    │
│  │  Step 3 de 3            │    │
│  └────────────────────────┘    │
│                                │
│  Como voce reagiu?             │
│                                │
│  ┌────────────────────────┐    │
│  │                        │    │
│  │  Descreva sua reacao   │    │
│  │  diante da situacao... │    │
│  │                        │    │
│  └────────────────────────┘    │
│  (textarea, 4-5 rows)         │
│                                │
│  Como voce avalia sua reacao?  │
│                                │
│  ┌──────────┐ ┌────────────┐  │
│  │ Reativa  │ │Estrategica │  │
│  └──────────┘ └────────────┘  │
│  ┌──────────┐                  │
│  │ Nao sei  │                  │
│  └──────────┘                  │
│                                │
│  ┌──────────┐ ┌───────────┐   │
│  │  VOLTAR  │ │ FINALIZAR │   │
│  │  (ghost) │ │ (#E53935) │   │
│  └──────────┘ └───────────┘   │
│                                │
└────────────────────────────────┘
```

### Component Map

- `ProgressBar` → 3/3 filled (complete)
- `Heading` → "Como voce reagiu?"
- `Textarea` → 4-5 rows, same styling as Step 1
- `Text` (label) → "Como voce avalia sua reacao?"
- `Chip` x3 → "Reativa", "Estrategica", "Nao sei". Single-select. Same styling as CategoryChips.
- `Button` (ghost) → "Voltar"
- `Button` (primary) → "Finalizar" — triggers entry save + AI reflection generation

### Data Model Mapping

- Textarea → `DailyEntry.reaction`
- Selected chip → `DailyEntry.self_perception` (enum: reactive, strategic, unsure)

### Responsive Behavior

- Mobile: Full-width layout, chips stack if needed
- Desktop: 400px centered, chips in single row

### Interactions

- Type in textarea → Required (min 10 characters)
- Select perception chip → Single-select
- Click "Voltar" → Back to Step 2, preserving state
- Click "Finalizar" → POST `DailyEntry` to API → Navigate to `/entry/reflection` → Trigger AI reflection generation in background

---

## 7. AI Reflection

**Route:** `/entry/reflection`
**Layout:** mobile-first (max-w ~400px)
**Responsive:** Centered narrow column on desktop.

### Wireframe — Loading State

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│                                │
│                                │
│           ⟳ (spinner)          │
│                                │
│     Gerando reflexao...        │
│                                │
│     Analisando seu registro    │
│     com base no Codigo A.D.V.  │
│                                │
│                                │
│                                │
└────────────────────────────────┘
```

### Wireframe — Loaded State

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│  Reflexao do dia               │
│  Baseada no Codigo A.D.V.      │
│                                │
│  ┌────────────────────────┐    │
│  │ 1.                     │    │
│  │ "Voce disse que reagiu │    │
│  │  com raiva. O que      │    │
│  │  teria mudado se voce  │    │
│  │  tivesse parado 10     │    │
│  │  segundos antes?"      │    │
│  │                        │    │
│  │  ┌──────────────────┐  │    │
│  │  │ Sua resposta     │  │    │
│  │  │ (opcional)...    │  │    │
│  │  └──────────────────┘  │    │
│  └────────────────────────┘    │
│                                │
│  ┌────────────────────────┐    │
│  │ 2.                     │    │
│  │ "Se um mentorado seu   │    │
│  │  relatasse essa mesma  │    │
│  │  situacao, qual        │    │
│  │  conselho voce daria?" │    │
│  │                        │    │
│  │  ┌──────────────────┐  │    │
│  │  │ Sua resposta     │  │    │
│  │  │ (opcional)...    │  │    │
│  │  └──────────────────┘  │    │
│  └────────────────────────┘    │
│                                │
│  ┌────────────────────────┐    │
│  │ 3.                     │    │
│  │ "Autogoverno e agir    │    │
│  │  com intencao. Qual    │    │
│  │  foi sua intencao      │    │
│  │  real nesse momento?"  │    │
│  │                        │    │
│  │  ┌──────────────────┐  │    │
│  │  │ Sua resposta     │  │    │
│  │  │ (opcional)...    │  │    │
│  │  └──────────────────┘  │    │
│  └────────────────────────┘    │
│                                │
│  ┌──────────────┐ ┌────────┐  │
│  │  RESPONDER   │ │ SALVAR │  │
│  │   DEPOIS     │ │RESPOS- │  │
│  │   (ghost)    │ │  TAS   │  │
│  │              │ │(#E53935│  │
│  └──────────────┘ └────────┘  │
│                                │
└────────────────────────────────┘
```

### Component Map

- `Spinner` → Loading state, centered, with animated rotation
- `Text` → "Gerando reflexao..." and subtitle
- `Heading` → "Reflexao do dia"
- `Text` (subtitle) → "Baseada no Codigo A.D.V."
- `ReflectionCard` x2-3 → Dark card (`#111` bg, `#222` border), contains:
  - Numbered question in bold white text
  - Optional `Textarea` (2-3 rows) for user response, same dark styling
- `Button` (ghost) → "Responder depois" — skips answers, goes to confirmation
- `Button` (primary) → "Salvar respostas" — saves answers then goes to confirmation

### Data Model Mapping

- Questions displayed → `AIReflection.questions` (JSON array of strings)
- User answers in textareas → `AIReflection.answers` (JSON array, nullable entries)
- Linked to → `AIReflection.entry_id` → `DailyEntry.id`

### Responsive Behavior

- Mobile: Cards stack vertically, full-width
- Desktop: 400px centered, same stacked layout

### Interactions

- Page load → Show spinner → Call AI API with entry data → Render reflection cards
- Type in textarea → Optional, can be left empty
- Click "Responder depois" → Save `AIReflection` with `answers: null` → Navigate to `/entry/confirmation`
- Click "Salvar respostas" → Save `AIReflection` with answers array → Navigate to `/entry/confirmation`
- AI generation error → Show error message with "Tentar novamente" button

---

## 8. Confirmation

**Route:** `/entry/confirmation`
**Layout:** mobile-first (max-w ~400px, centered vertically)
**Responsive:** Centered on all viewports.

### Wireframe

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│                                │
│                                │
│              ✓                 │
│         (large green           │
│          check icon            │
│          #4CAF50)              │
│                                │
│      Registro salvo.           │
│                                │
│   Mais um dia de autogoverno.  │
│                                │
│  ┌────────────────────────┐    │
│  │  🔥 13 dias             │    │
│  │  ● ● ● ● ● ● ●        │    │
│  │  (streak atualizado)   │    │
│  └────────────────────────┘    │
│                                │
│  ┌────────────────────────┐    │
│  │    VER HISTORICO       │    │
│  │   (ghost button)      │    │
│  └────────────────────────┘    │
│                                │
│  ┌────────────────────────┐    │
│  │  VOLTAR AO INICIO     │    │
│  │     (#E53935 bg)       │    │
│  └────────────────────────┘    │
│                                │
│                                │
└────────────────────────────────┘
```

### Component Map

- `Icon` → Large check circle, green `#4CAF50`, ~64px
- `Heading` → "Registro salvo." — white, centered
- `Text` → "Mais um dia de autogoverno." — `#AAA`, centered
- `StreakCounter` → Updated streak count and calendar dots (today filled)
- `Button` (ghost) → "Ver historico" — border `#333`
- `Button` (primary) → "Voltar ao inicio" — bg `#E53935`

### Data Model Mapping

- Streak count → Recomputed from `DailyEntry` consecutive dates
- Calendar dots → `DailyEntry` existence for current week (today now filled)

### Responsive Behavior

- Mobile: Full-width, vertically centered in viewport
- Desktop: 400px container, vertically centered

### Interactions

- Click "Ver historico" → Navigate to `/history`
- Click "Voltar ao inicio" → Navigate to `/` (mentee home)
- Auto-redirect after 10 seconds of inactivity → `/` (mentee home)

---

## 9. History / Timeline

**Route:** `/history`
**Layout:** mobile-first (max-w ~400px)
**Responsive:** On desktop, content column stays narrow; sidebar could appear.

### Wireframe

```
┌────────────────────────────────┐
│         max-w: 400px           │
│                                │
│  Historico                     │
│                                │
│  ┌──────────┐ ┌─────────────┐ │
│  │ Fev 2026 │ │ Todas ▾     │ │
│  │    ▾     │ │ (categoria) │ │
│  └──────────┘ └─────────────┘ │
│                                │
│  ── 27 Fev 2026 ──────────── │
│                                │
│  ┌────────────────────────┐    │
│  │  📅 27/02  │ Audiencia │    │
│  │  😰 Ansiedade    ██ 7  │    │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │    │
│  │  ▶ Expandir             │    │
│  └────────────────────────┘    │
│                                │
│  ── 26 Fev 2026 ──────────── │
│                                │
│  ┌────────────────────────┐    │
│  │  📅 26/02  │ Cliente   │    │
│  │  😤 Frustracao   ███ 5 │    │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │    │
│  │  ▶ Expandir             │    │
│  └────────────────────────┘    │
│                                │
│  ┌────────────────────────┐    │
│  │ ▼ EXPANDED CARD        │    │
│  │                        │    │
│  │  📅 25/02  │ Equipe    │    │
│  │  😡 Raiva       ████ 8 │    │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │    │
│  │                        │    │
│  │  Situacao:             │    │
│  │  "Discussao com socio  │    │
│  │   sobre divisao de..." │    │
│  │                        │    │
│  │  Reacao:               │    │
│  │  "Levantei a voz e     │    │
│  │   depois me arrependi" │    │
│  │                        │    │
│  │  Percepcao: Reativa    │    │
│  │                        │    │
│  │  Reflexao IA:          │    │
│  │  "O que voce faria     │    │
│  │   diferente se..."     │    │
│  │                        │    │
│  │  ▲ Recolher            │    │
│  └────────────────────────┘    │
│                                │
│  (scroll for more entries)     │
│                                │
├────────────────────────────────┤
│  🏠 Home │ 📋 Historico│ 👤   │
│          │  (active)   │Perfil │
└────────────────────────────────┘
```

### Component Map

- `Heading` → "Historico"
- `FilterBar` → Contains:
  - Month selector dropdown — dark bg, border `#333`, text white
  - Category filter dropdown — "Todas" default, lists all categories
- `DateSeparator` → Thin line with date label, `#666` text
- `EntryCard` (collapsed) → Dark card `#111`, shows:
  - Date (left) + Category chip (right, small)
  - Emotion icon + label + Intensity bar (colored, proportional) + value
  - "Expandir" toggle
- `EntryCard` (expanded) → Same card expanded to show:
  - Full situation text
  - Full reaction text
  - Self-perception label
  - AI reflection summary (first question)
  - "Recolher" toggle
- `BottomNav` → "Historico" tab active

### Data Model Mapping

- Date → `DailyEntry.date`
- Category → `DailyEntry.category`
- Emotion → `DailyEntry.emotion`
- Intensity → `DailyEntry.intensity`
- Situation → `DailyEntry.situation`
- Reaction → `DailyEntry.reaction`
- Perception → `DailyEntry.self_perception`
- AI Reflection → `AIReflection.questions[0]` (summary)

### Responsive Behavior

- Mobile: Full-width cards, bottom nav visible
- Desktop: 400-600px content column centered, bottom nav hidden (top nav instead)

### Interactions

- Change month dropdown → Filter entries to selected month
- Change category dropdown → Filter entries to selected category
- Click "Expandir" on card → Expand card with animation (slide down)
- Click "Recolher" on expanded card → Collapse card
- Scroll → Infinite scroll or paginated (load 10 at a time)

---

## 10. Mentor Dashboard Overview

**Route:** `/mentor`
**Layout:** desktop-first (sidebar 240px + main content)
**Responsive:** On mobile, sidebar collapses to hamburger menu; cards stack vertically.

### Wireframe

```
┌──────────────┬──────────────────────────────────────────────────────┐
│              │                                                      │
│  DIARIO DE   │  Visao Geral                                        │
│  AUTOGOVERNO │                                                      │
│              │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  ────────    │  │ Mentorados│ │ Registros│ │Engajamento│ │Alertas │ │
│              │  │  Ativos   │ │esta semana│ │  medio   │ │        │ │
│  ● Visao     │  │           │ │          │ │          │ │        │ │
│    Geral     │  │    12     │ │    47    │ │   78%    │ │   3    │ │
│  (active)    │  │           │ │          │ │          │ │(#E53935│ │
│              │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│  ○ Mentorados│                                                      │
│              │  ┌──────────────────────────────────────────────────┐ │
│  ○ Insights  │  │ ⚠ Alertas de Inatividade                       │ │
│              │  │                                                  │ │
│  ○ Meu Diario│  │  🔴 Ana Costa — 7 dias sem registro             │ │
│              │  │  🔴 Pedro Lima — 6 dias sem registro             │ │
│  ────────    │  │  🟡 Julia Santos — 4 dias sem registro           │ │
│              │  │                                                  │ │
│  ┌────────┐  │  └──────────────────────────────────────────────────┘ │
│  │ 👤     │  │                                                      │
│  │ Rafael │  │  ┌──────────────────────────────────────────────────┐ │
│  │ Coelho │  │  │ Atividade Recente                               │ │
│  └────────┘  │  │                                                  │ │
│              │  │  Data     │ Mentorado  │Categoria │Emocao │Intens│ │
│              │  │  ─────────┼────────────┼──────────┼───────┼──────│ │
│              │  │  27/02    │ Carlos M.  │Audiencia │Ansied.│  7   │ │
│              │  │  27/02    │ Maria S.   │Cliente   │Raiva  │  8   │ │
│              │  │  26/02    │ Joao P.    │Negociac. │Medo   │  6   │ │
│              │  │  26/02    │ Lucia R.   │Cobranca  │Frustr.│  5   │ │
│              │  │  26/02    │ Andre L.   │Equipe    │Inseg. │  4   │ │
│              │  │                                                  │ │
│              │  └──────────────────────────────────────────────────┘ │
│              │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
      240px                        remaining width
```

### Component Map

- `MentorSidebar` → Fixed 240px width, dark bg `#000` or `#0A0A0A`, contains:
  - App logo/name at top
  - Nav items: Visao Geral (active), Mentorados, Insights, Meu Diario
  - Divider line `#222`
  - User avatar + name at bottom
- `SummaryCard` x4 → Row of 4 cards, dark bg `#111`, border `#222`:
  - "Mentorados Ativos" — count of mentees with entries in last 7 days
  - "Registros esta semana" — total entries this week
  - "Engajamento medio" — percentage of mentees who registered this week
  - "Alertas" — count of inactive mentees (3+ days), red accent if > 0
- `AlertList` → Section with warning icon, lists mentees sorted by days inactive:
  - Red dot for 5+ days, yellow dot for 3-5 days
  - Name + days since last entry
- `ActivityTable` → Recent entries table with columns: Date, Mentee name, Category, Emotion, Intensity

### Data Model Mapping

- Active mentees → Count of `User` (role=mentee) with `DailyEntry` in last 7 days
- Weekly entries → Count of `DailyEntry` with `date` in current week
- Engagement → (Active mentees / Total mentees) * 100
- Alerts → `User` (role=mentee) without `DailyEntry` for 3+ days
- Activity table → Recent `DailyEntry` records joined with `User.name`
- Note: Rafael's own entries (role=mentor) are excluded from all dashboard aggregations

### Responsive Behavior

- Desktop (>1024px): Sidebar visible, 4 cards in row, table with all columns
- Tablet (768-1024px): Sidebar collapsible, cards 2x2 grid, table scrollable
- Mobile (<768px): Sidebar becomes hamburger menu, cards stack vertically, table becomes card list

### Interactions

- Click nav item → Navigate to corresponding route
- Click alert row → Navigate to `/mentor/mentee/[id]`
- Click activity table row → Navigate to `/mentor/mentee/[id]`
- Click "Meu Diario" → Navigate to `/mentor/diary` (switches to practitioner mode)

---

## 11. Mentee List

**Route:** `/mentor/mentees`
**Layout:** desktop-first (sidebar 240px + main content)
**Responsive:** On mobile, sidebar collapses; list becomes full-width cards.

### Wireframe

```
┌──────────────┬──────────────────────────────────────────────────────┐
│              │                                                      │
│  DIARIO DE   │  Mentorados                                         │
│  AUTOGOVERNO │                                                      │
│              │  ┌──────────────────────────────────────────────────┐ │
│  ────────    │  │ 🔍 Buscar mentorado...                          │ │
│              │  └──────────────────────────────────────────────────┘ │
│  ○ Visao     │                                                      │
│    Geral     │  ┌──────────────────────────────────────────────────┐ │
│              │  │                                                  │ │
│  ● Mentorados│  │  Status │ Nome          │Streak│Media │Ultimo   │ │
│  (active)    │  │  ───────┼───────────────┼──────┼──────┼─────────│ │
│              │  │  🟢     │ Carlos Mendes │ 15 d │ 5.2  │ hoje    │ │
│  ○ Insights  │  │  🟢     │ Maria Silva   │ 12 d │ 6.8  │ hoje    │ │
│              │  │  🟢     │ Andre Lima    │  8 d │ 4.1  │ ontem   │ │
│  ○ Meu Diario│  │  🟡     │ Lucia Reis    │  0 d │ 7.3  │ 3d atras│ │
│              │  │  🟡     │ Julia Santos  │  0 d │ 5.5  │ 4d atras│ │
│  ────────    │  │  🔴     │ Ana Costa     │  0 d │ 8.1  │ 7d atras│ │
│              │  │  🔴     │ Pedro Lima    │  0 d │ 6.0  │ 6d atras│ │
│  ┌────────┐  │  │                                                  │ │
│  │ 👤     │  │  └──────────────────────────────────────────────────┘ │
│  │ Rafael │  │                                                      │
│  │ Coelho │  │  Legenda:                                           │
│  └────────┘  │  🟢 Ativo (ultimo registro <=2 dias)                │
│              │  🟡 Ausente (3-5 dias sem registro)                  │
│              │  🔴 Inativo (5+ dias sem registro)                   │
│              │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
      240px                        remaining width
```

### Component Map

- `MentorSidebar` → Same as Dashboard Overview, "Mentorados" active
- `Heading` → "Mentorados"
- `Input` (search) → Search field with icon, dark bg, placeholder "Buscar mentorado..."
- `MenteeRow` xN → Table rows with columns:
  - Status dot: green `#4CAF50` (<=2d), yellow `#FFC107` (3-5d), red `#E53935` (5+d)
  - Name
  - Streak (days)
  - Average intensity (last 7 entries)
  - Last entry relative date
- `Text` (legend) → Status dot color legend

### Data Model Mapping

- Status dot → Computed from `MAX(DailyEntry.date)` per user vs today
- Name → `User.name`
- Streak → Consecutive `DailyEntry.date` count ending today or yesterday
- Average intensity → `AVG(DailyEntry.intensity)` for last 7 entries
- Last entry → `MAX(DailyEntry.date)` formatted as relative time

### Responsive Behavior

- Desktop: Full table layout with sortable columns
- Tablet: Table with horizontal scroll
- Mobile: Each mentee becomes a card with stacked fields:
  ```
  ┌────────────────────┐
  │ 🟢 Carlos Mendes   │
  │ Streak: 15d        │
  │ Media: 5.2 | hoje  │
  └────────────────────┘
  ```

### Interactions

- Type in search → Filter list by name (client-side, debounced)
- Click row → Navigate to `/mentor/mentee/[id]` (mentee profile)
- Click column header → Sort by that column (asc/desc toggle)
- Status dots are not clickable

---

## 12. Mentor "Meu Diario" (Switch Mode)

**Route:** `/mentor/diary`
**Layout:** desktop-first (sidebar 240px + mentee home content)
**Responsive:** On mobile, sidebar collapses; content becomes identical to regular mentee home.

### Wireframe

```
┌──────────────┬────────────────────────────────────┐
│              │        max-w: 400px (centered)     │
│  DIARIO DE   │                                    │
│  AUTOGOVERNO │  ← Voltar ao Dashboard             │
│              │                                    │
│  ────────    │  Boa noite, Rafael.                │
│              │  Como foi seu dia?                 │
│  ○ Visao     │                                    │
│    Geral     │  ┌────────────────────────┐        │
│              │  │  🔥 22 dias             │        │
│  ○ Mentorados│  │  ● ● ● ● ● ● ●        │        │
│              │  └────────────────────────┘        │
│  ○ Insights  │                                    │
│              │  ┌────────────────────────┐        │
│  ● Meu Diario│  │                        │        │
│  (active)    │  │    REGISTRAR O DIA     │        │
│              │  │     (#E53935 bg)       │        │
│  ────────    │  │                        │        │
│              │  └────────────────────────┘        │
│  ┌────────┐  │                                    │
│  │ 👤     │  │  Resumo da semana                 │
│  │ Rafael │  │  ┌────────────────────────┐        │
│  │ Coelho │  │  │  ▂ ▅ ▃ ▇ ▂ ▄ ▆        │        │
│  └────────┘  │  │  S  T  Q  Q  S  S  D  │        │
│              │  └────────────────────────┘        │
│              │                                    │
│              │  ┌──────────────────┐              │
│              │  │  📋 Meu Historico │              │
│              │  └──────────────────┘              │
│              │                                    │
└──────────────┴────────────────────────────────────┘
      240px              remaining width
```

### Component Map

- `MentorSidebar` (variant) → Same sidebar with:
  - "Meu Diario" nav item highlighted as active
  - All other nav items still accessible
- `Text` (link) → "← Voltar ao Dashboard" at top of content area — navigates to `/mentor`
- `MenteeHome` (reused) → Exact same layout and components as Screen 3, but:
  - Rendered inside the desktop sidebar layout instead of standalone mobile
  - Content area limited to ~400px, centered in the remaining space
  - Bottom nav is NOT shown (sidebar handles navigation)
  - Extra link "Meu Historico" replaces bottom nav history tab
- `StreakCounter` → Rafael's personal streak (private data)
- `WeeklySummaryBar` → Rafael's personal intensity bars (private data)

### Data Model Mapping

- All data scoped to `User.id` where `role = mentor` (Rafael)
- Streak → Rafael's consecutive `DailyEntry` records
- Weekly bars → Rafael's `DailyEntry.intensity` values
- Entries created here → `DailyEntry.user_id = Rafael.id` (NEVER visible in mentor dashboard aggregations)

### Responsive Behavior

- Desktop: Sidebar + centered mentee home content (max-w 400px)
- Tablet: Sidebar collapsible, content fills remaining space
- Mobile: Sidebar hidden (hamburger), content becomes identical to standalone mentee home (with "Voltar ao Dashboard" link at top instead of bottom nav)

### Interactions

- Click "← Voltar ao Dashboard" → Navigate to `/mentor`
- Click "Registrar o dia" → Navigate to `/entry/step-1` (same entry flow, entries saved under Rafael's user_id)
- Click "Meu Historico" → Navigate to `/mentor/diary/history` (same History screen but filtered to Rafael only)
- All other interactions identical to Mentee Home (Screen 3)
- Privacy: Rafael's personal entries are stored with his `user_id` and filtered OUT of all mentor dashboard queries

---

## Component Inventory (MVP Phase 1)

| Component | Used In Screens | Variants |
|-----------|----------------|----------|
| `Input` | 1, 2, 11 | text, password, search |
| `Button` | 1-12 | primary (red), ghost (transparent), secondary |
| `Heading` | 1-12 | h1 (page title), h2 (section), h3 (card) |
| `Text` | 1-12 | body, subtitle, link, label, caption |
| `ProgressBar` | 4, 5, 6 | 1/3, 2/3, 3/3 filled |
| `Textarea` | 4, 6, 7 | 4-5 rows, 2-3 rows |
| `CategoryChips` | 4 | 7 category options |
| `EmotionPicker` | 5 | 7 emotion cards with icons |
| `IntensitySlider` | 5 | Range 1-10, gradient track |
| `Chip` | 4, 6, 9 | selectable, display-only |
| `StreakCounter` | 3, 8, 12 | with/without calendar dots |
| `WeeklySummaryBar` | 3, 12 | 7-bar intensity chart |
| `BottomNav` | 3, 9 | 3 tabs (Home, Historico, Perfil) |
| `ReflectionCard` | 7 | with/without textarea |
| `Spinner` | 7 | loading animation |
| `Icon` | 8 | check circle (green) |
| `EntryCard` | 9 | collapsed, expanded |
| `FilterBar` | 9 | month selector + category |
| `DateSeparator` | 9 | line with date label |
| `MentorSidebar` | 10, 11, 12 | default, "Meu Diario" variant |
| `SummaryCard` | 10 | metric label + value |
| `AlertList` | 10 | warning rows with status |
| `ActivityTable` | 10 | sortable columns |
| `MenteeRow` | 11 | status dot + metrics |

---

## Route Map

| Route | Screen | Auth | Role |
|-------|--------|------|------|
| `/login` | 1. Login | Public | — |
| `/register` | 2. Register | Public | — |
| `/` | 3. Mentee Home | Auth | mentee, mentor |
| `/entry/step-1` | 4. Entry Step 1 | Auth | mentee, mentor |
| `/entry/step-2` | 5. Entry Step 2 | Auth | mentee, mentor |
| `/entry/step-3` | 6. Entry Step 3 | Auth | mentee, mentor |
| `/entry/reflection` | 7. AI Reflection | Auth | mentee, mentor |
| `/entry/confirmation` | 8. Confirmation | Auth | mentee, mentor |
| `/history` | 9. History | Auth | mentee, mentor |
| `/mentor` | 10. Dashboard | Auth | mentor |
| `/mentor/mentees` | 11. Mentee List | Auth | mentor |
| `/mentor/diary` | 12. Meu Diario | Auth | mentor |

---

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#000000` | Page backgrounds |
| `--bg-surface` | `#111111` | Cards, inputs, elevated surfaces |
| `--bg-surface-hover` | `#1A1A1A` | Hover state on surfaces |
| `--border-default` | `#222222` | Card borders, dividers |
| `--border-subtle` | `#333333` | Input borders, chip borders |
| `--text-primary` | `#FFFFFF` | Headings, body text |
| `--text-secondary` | `#AAAAAA` | Subtitles, placeholders |
| `--text-muted` | `#666666` | Hints, disabled text |
| `--accent-red` | `#E53935` | Primary buttons, active states, alerts |
| `--accent-red-hover` | `#C62828` | Button hover state |
| `--accent-green` | `#4CAF50` | Success states, low intensity, active status |
| `--accent-yellow` | `#FFC107` | Warning states, medium intensity, absent status |
| `--intensity-gradient` | `#4CAF50 → #FFC107 → #E53935` | Slider track, intensity bars |

---

## Typography Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `heading-xl` | 28px | 700 | Page titles (Mentee Home greeting) |
| `heading-lg` | 24px | 700 | Section titles (Dashboard "Visao Geral") |
| `heading-md` | 20px | 600 | Card headings, step questions |
| `heading-sm` | 16px | 600 | Sub-section titles |
| `body-lg` | 16px | 400 | Primary body text |
| `body-md` | 14px | 400 | Secondary text, table cells |
| `body-sm` | 12px | 400 | Captions, labels, timestamps |
| `button-lg` | 16px | 600 | Primary CTA buttons |
| `button-md` | 14px | 500 | Secondary buttons |

Font family: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Tight gaps (icon-to-text) |
| `space-sm` | 8px | Chip padding, compact spacing |
| `space-md` | 16px | Standard padding, component gaps |
| `space-lg` | 24px | Section spacing |
| `space-xl` | 32px | Page-level padding |
| `space-2xl` | 48px | Major section separators |

---

## Breakpoints

| Name | Value | Layout |
|------|-------|--------|
| `mobile` | < 768px | Single column, bottom nav |
| `tablet` | 768px - 1024px | Collapsible sidebar, 2-col grid |
| `desktop` | > 1024px | Fixed sidebar 240px + content |
