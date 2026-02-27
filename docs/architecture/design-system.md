# Design System Specification

**Project:** Diario de Autogoverno
**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2026-02-27

---

## Table of Contents

1. [Overview](#1-overview)
2. [Token Architecture](#2-token-architecture)
3. [Color System](#3-color-system)
4. [Typography System](#4-typography-system)
5. [Spacing System](#5-spacing-system)
6. [Component Catalog](#6-component-catalog)
7. [Responsive Breakpoints](#7-responsive-breakpoints)
8. [Accessibility](#8-accessibility)
9. [Dark Mode Strategy](#9-dark-mode-strategy)
10. [File Structure](#10-file-structure)

---

## 1. Overview

**Diario de Autogoverno** is a web application designed exclusively for lawyers (advogados) who are mentored by Rafael Coelho. Mentees record daily entries about high-pressure situations, conflicts, and decisions, then receive AI-generated reflections grounded in the "Codigo A.D.V." framework (Autogoverno, Direcao, Verdade).

### Design Philosophy

- **Dark, minimal, focused.** The interface stays out of the way. The user's thoughts are the content.
- **Speed over decoration.** A daily entry must complete in under 5 minutes across 3 steps.
- **Calm authority.** The visual language conveys discipline and clarity, not corporate polish or playful energy.
- **Respectful data density.** The mentor dashboard surfaces patterns without overwhelming; the mentee interface presents one task at a time.

### Target Audiences

| Audience | Device Priority | Experience |
|----------|----------------|------------|
| Mentees (advogados) | Mobile-first (~375px baseline) | Daily journal entry, history review, AI reflections |
| Mentor (Rafael) | Desktop-first (1280px baseline) | Dashboard with all mentee data, analytics, session prep |

### Key Constraints

- Lawyers in courthouses may have limited connectivity; interfaces must be lightweight.
- PWA installation is planned; the design must work without browser chrome.
- Dark mode only for MVP; the token architecture supports future light mode.

---

## 2. Token Architecture

The design system uses a three-layer token architecture that separates raw values from their semantic meaning and component-level application.

### Layer Model

```
Core Tokens (raw values)
    |
    v
Semantic Tokens (purpose-based aliases)
    |
    v
Component Tokens (pre-composed per component)
```

| Layer | Purpose | Example |
|-------|---------|---------|
| **Core** | Raw, context-free values | `color-red-500: #E53935`, `spacing-4: 16px` |
| **Semantic** | Purpose-based aliases that map to core tokens | `bg-primary: color-black`, `text-accent: color-red-500` |
| **Component** | Pre-composed values for specific components | `button-primary-bg: bg-accent`, `input-border: border-default` |

### Naming Convention

- **Format:** `kebab-case` throughout all layers.
- **Approach:** Semantic-first. Consumers reference semantic or component tokens; core tokens are internal.
- **Pattern:** `{category}-{modifier}-{variant}` (e.g., `text-primary`, `bg-surface-hover`, `button-primary-bg`).

### Source of Truth

**File:** `packages/ui/tokens/tokens.yaml`

All downstream formats are generated from this single source:

| Export | File | Usage |
|--------|------|-------|
| CSS Custom Properties | `packages/ui/tokens/tokens.css` | Runtime styling, global scope |
| TypeScript Object | `packages/ui/tokens/tokens.ts` | Type-safe access in components |
| Tailwind Theme Extension | `packages/ui/tokens/tokens.tailwind.ts` | Tailwind utility class generation |

### Token YAML Structure (excerpt)

```yaml
core:
  color:
    black: "#000000"
    white: "#FFFFFF"
    red-500: "#E53935"
    neutral-900: "#212121"
    # ...
  spacing:
    0: "0px"
    1: "4px"
    2: "8px"
    # ...

semantic:
  bg:
    primary: "{core.color.black}"
    surface: "{core.color.neutral-900}"
    surface-hover: "{core.color.neutral-800}"
    accent: "{core.color.red-500}"
  text:
    primary: "{core.color.white}"
    secondary: "{core.color.neutral-500}"
    muted: "{core.color.neutral-600}"
    accent: "{core.color.red-500}"
  # ...

component:
  button:
    primary-bg: "{semantic.bg.accent}"
    primary-text: "{semantic.text.primary}"
    # ...
```

---

## 3. Color System

### Core Palette

| Token | Hex | Preview | Role |
|-------|-----|---------|------|
| `color-black` | `#000000` | ![#000000](https://via.placeholder.com/16/000000/000000) | Primary background |
| `color-white` | `#FFFFFF` | ![#FFFFFF](https://via.placeholder.com/16/FFFFFF/FFFFFF) | Primary text |
| `color-red-500` | `#E53935` | ![#E53935](https://via.placeholder.com/16/E53935/E53935) | Accent, highlights, CTAs |
| `color-red-600` | `#C62828` | ![#C62828](https://via.placeholder.com/16/C62828/C62828) | Accent hover state |
| `color-red-400` | `#EF5350` | ![#EF5350](https://via.placeholder.com/16/EF5350/EF5350) | Accent light (badges, indicators) |
| `color-neutral-900` | `#212121` | ![#212121](https://via.placeholder.com/16/212121/212121) | Surface (cards, panels) |
| `color-neutral-800` | `#424242` | ![#424242](https://via.placeholder.com/16/424242/424242) | Surface hover, borders |
| `color-neutral-700` | `#616161` | ![#616161](https://via.placeholder.com/16/616161/616161) | Dividers, subtle borders |
| `color-neutral-600` | `#757575` | ![#757575](https://via.placeholder.com/16/757575/757575) | Muted text, placeholders |
| `color-neutral-500` | `#9E9E9E` | ![#9E9E9E](https://via.placeholder.com/16/9E9E9E/9E9E9E) | Secondary text |
| `color-neutral-400` | `#BDBDBD` | ![#BDBDBD](https://via.placeholder.com/16/BDBDBD/BDBDBD) | Disabled text |

### Status Colors

| Token | Hex | Preview | Usage |
|-------|-----|---------|-------|
| `color-success` | `#4CAF50` | ![#4CAF50](https://via.placeholder.com/16/4CAF50/4CAF50) | Active status, success states, streak active |
| `color-warning` | `#FFC107` | ![#FFC107](https://via.placeholder.com/16/FFC107/FFC107) | Absent status (3-5 days), caution |
| `color-danger` | `#E53935` | ![#E53935](https://via.placeholder.com/16/E53935/E53935) | Inactive status (5+ days), errors, destructive |

### Intensity Gradient (Slider)

| Range | Color | Hex |
|-------|-------|-----|
| 1-3 (low) | Green | `#4CAF50` |
| 4-6 (medium) | Yellow | `#FFC107` |
| 7-10 (high) | Red | `#E53935` |

The slider track renders a continuous CSS gradient from green through yellow to red.

### Semantic Color Mapping

| Semantic Token | Maps To | Usage |
|----------------|---------|-------|
| `bg-primary` | `color-black` | Page backgrounds |
| `bg-surface` | `color-neutral-900` | Cards, modals, panels |
| `bg-surface-hover` | `color-neutral-800` | Interactive surface hover |
| `bg-accent` | `color-red-500` | Primary buttons, active indicators |
| `bg-accent-hover` | `color-red-600` | Primary button hover |
| `text-primary` | `color-white` | Headings, body text |
| `text-secondary` | `color-neutral-500` | Supporting text, labels |
| `text-muted` | `color-neutral-600` | Placeholders, captions |
| `text-accent` | `color-red-500` | Links, emphasis, highlights |
| `border-default` | `color-neutral-700` | Input borders, dividers |
| `border-focus` | `color-red-500` | Focus rings |
| `status-active` | `color-success` | Active mentee indicator |
| `status-absent` | `color-warning` | Absent mentee indicator |
| `status-inactive` | `color-danger` | Inactive mentee indicator |

### WCAG AA Contrast Ratios

All text-background combinations must meet WCAG AA minimum contrast requirements. The following table documents verified ratios for the primary pairings used in the system.

| Combination | Ratio | Pass? | Notes |
|-------------|-------|-------|-------|
| White (`#FFFFFF`) on Black (`#000000`) | 21:1 | AA Pass | Primary text on page background |
| White (`#FFFFFF`) on neutral-900 (`#212121`) | ~11.6:1 | AA Pass | Text on card/surface backgrounds |
| neutral-500 (`#9E9E9E`) on Black (`#000000`) | ~7.4:1 | AA Pass | Secondary text on page background |
| neutral-600 (`#757575`) on Black (`#000000`) | ~4.6:1 | AA Pass (large text only) | Muted text; minimum 18px or 14px bold. Normal contrast requirement is 4.5:1; passes AA Large (3:1) |
| White (`#FFFFFF`) on Red-500 (`#E53935`) | ~4.02:1 | AA Large Only | Use only for text >= 18px or bold >= 14px. Does NOT pass AA for normal-sized text |
| White (`#FFFFFF`) on neutral-800 (`#424242`) | ~7.1:1 | AA Pass | Text on hover surfaces |

**Design Rule:** Red (`#E53935`) on dark backgrounds must be used only as accent color for badges, icons, or large headings (>= 18px). Never use red as a background for normal-sized white text in body copy.

---

## 4. Typography System

### Font Family

- **Primary:** Inter
- **Loading:** `next/font/google` with `display: 'swap'`
- **CSS Variable:** `--font-inter`
- **Fallback Stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

### Type Scale

| Token | Size (px) | Size (rem) | Default Line Height | Typical Usage |
|-------|-----------|------------|---------------------|---------------|
| `text-xs` | 12 | 0.75 | 1.5 (normal) | Captions, overlines, timestamps |
| `text-sm` | 14 | 0.875 | 1.5 (normal) | Labels, secondary text, badges |
| `text-base` | 16 | 1.0 | 1.5 (normal) | Body text, inputs, buttons |
| `text-lg` | 18 | 1.125 | 1.375 (snug) | Subheadings, card titles |
| `text-xl` | 20 | 1.25 | 1.375 (snug) | Section headings |
| `text-2xl` | 24 | 1.5 | 1.25 (tight) | Page titles |
| `text-3xl` | 30 | 1.875 | 1.25 (tight) | Hero headings |
| `text-4xl` | 36 | 2.25 | 1.25 (tight) | Display headings (streak count) |

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `font-regular` | 400 | Body text, inputs, descriptions |
| `font-medium` | 500 | Labels, navigation items, button text |
| `font-semibold` | 600 | Subheadings, card titles, emphasis |
| `font-bold` | 700 | Page headings, display numbers (streak), primary CTAs |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.25 | Headings (2xl and above) |
| `leading-snug` | 1.375 | Subheadings (lg, xl) |
| `leading-normal` | 1.5 | Body text, labels, most UI text |
| `leading-relaxed` | 1.625 | Long-form text, reflections, AI output |
| `leading-loose` | 1.75 | Spacious reading contexts (rare) |

### Usage Guide

| Context | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page title | `text-2xl` | `font-bold` | `leading-tight` |
| Section heading | `text-xl` | `font-semibold` | `leading-snug` |
| Card title | `text-lg` | `font-semibold` | `leading-snug` |
| Body text | `text-base` | `font-regular` | `leading-normal` |
| AI reflection text | `text-base` | `font-regular` | `leading-relaxed` |
| Button label | `text-sm` / `text-base` | `font-medium` | `leading-normal` |
| Input text | `text-base` | `font-regular` | `leading-normal` |
| Caption / timestamp | `text-xs` | `font-regular` | `leading-normal` |
| Badge text | `text-xs` / `text-sm` | `font-medium` | `leading-normal` |
| Streak counter number | `text-4xl` | `font-bold` | `leading-tight` |

---

## 5. Spacing System

### Base Unit

All spacing derives from a **4px base unit**. This creates a consistent rhythm across the interface.

### Scale

| Token | Value (px) | Value (rem) | Common Usage |
|-------|------------|-------------|--------------|
| `spacing-0` | 0 | 0 | Reset, collapse |
| `spacing-1` | 4 | 0.25 | Tight inline gaps, icon-to-text |
| `spacing-2` | 8 | 0.5 | Compact padding, chip gaps |
| `spacing-3` | 12 | 0.75 | Small card padding, list item gaps |
| `spacing-4` | 16 | 1.0 | Standard padding, form field gaps |
| `spacing-5` | 20 | 1.25 | Medium padding |
| `spacing-6` | 24 | 1.5 | Section padding, card internal spacing |
| `spacing-8` | 32 | 2.0 | Large padding, section gaps |
| `spacing-10` | 40 | 2.5 | Major section separation |
| `spacing-12` | 48 | 3.0 | Page-level vertical rhythm |
| `spacing-16` | 64 | 4.0 | Large visual breaks |
| `spacing-20` | 80 | 5.0 | Hero-level spacing |
| `spacing-24` | 96 | 6.0 | Maximum section spacing |

### Usage Guidelines

| Context | Token(s) |
|---------|----------|
| Inline icon-to-text gap | `spacing-1` to `spacing-2` |
| Padding inside buttons | `spacing-2` (vertical) / `spacing-4` (horizontal) |
| Gap between form fields | `spacing-4` to `spacing-6` |
| Card internal padding | `spacing-4` (mobile) / `spacing-6` (desktop) |
| Gap between cards in a list | `spacing-3` to `spacing-4` |
| Section vertical spacing | `spacing-8` to `spacing-12` |
| Page container padding | `spacing-4` (mobile) / `spacing-8` (desktop) |
| Sidebar width | `spacing-16` x 4 = 256px |

---

## 6. Component Catalog

Components follow **Atomic Design** methodology: Atoms, Molecules, Organisms.

All components are built with:
- **TypeScript** for type safety
- **Tailwind CSS** for styling (referencing design tokens)
- **`class-variance-authority` (CVA)** for variant management
- **`cn()` utility** (clsx + tailwind-merge) for class composition
- **`React.forwardRef`** where DOM ref access is needed

---

### 6.1 Atoms

#### Button

| Property | Details |
|----------|---------|
| **Description** | Primary interactive element for actions and navigation |
| **Variants** | `primary`, `secondary`, `ghost` |
| **Props** | `variant`, `size` (`sm` / `md` / `lg`), `disabled`, `loading`, `children`, `onClick`, `type`, `className` |
| **Primary** | Red-500 background, white text; hover: Red-600 |
| **Secondary** | Transparent with neutral-700 border, white text; hover: neutral-800 background |
| **Ghost** | Transparent, neutral-500 text; hover: neutral-900 background |
| **Loading** | Spinner replaces children; pointer-events disabled |
| **Sizes** | `sm`: text-sm, px-3, py-1.5 / `md`: text-base, px-4, py-2 / `lg`: text-lg, px-6, py-3 |

```tsx
<Button variant="primary" size="md" loading={isSubmitting}>
  Registrar o dia
</Button>
```

#### Input

| Property | Details |
|----------|---------|
| **Description** | Single-line text input with label and error support |
| **Variants** | `default`, `error`, `disabled` |
| **Props** | `type`, `placeholder`, `value`, `onChange`, `disabled`, `error` (boolean), `className`, `ref` (forwarded) |
| **Styling** | neutral-900 background, neutral-700 border, white text; focus: red-500 border + ring |
| **Error** | Red-500 border, red-400 text for error message below |

```tsx
<Input
  type="email"
  placeholder="seu@email.com"
  error={!!errors.email}
  ref={emailRef}
/>
```

#### Textarea

| Property | Details |
|----------|---------|
| **Description** | Multi-line text input for situation descriptions and reactions |
| **Variants** | `default`, `error` |
| **Props** | `rows`, `autoResize` (boolean), `placeholder`, `value`, `onChange`, `error`, `className`, `ref` (forwarded) |
| **Auto Resize** | When `autoResize` is true, height adjusts to content with a max-height constraint |

```tsx
<Textarea
  rows={4}
  autoResize
  placeholder="Descreva a situacao..."
/>
```

#### Label

| Property | Details |
|----------|---------|
| **Description** | Accessible label for form elements |
| **Variants** | `default`, `required` |
| **Props** | `htmlFor`, `required` (shows `*` indicator in red-500), `children`, `className` |

```tsx
<Label htmlFor="situation" required>
  O que aconteceu?
</Label>
```

#### Heading

| Property | Details |
|----------|---------|
| **Description** | Semantic heading element with visual size override capability |
| **Props** | `level` (1-6, determines semantic `<h1>`-`<h6>` tag), `as` (optional override for rendered tag), `size` (optional visual size override using type scale), `children`, `className` |
| **Default Mapping** | h1 = text-2xl bold, h2 = text-xl semibold, h3 = text-lg semibold, h4 = text-base semibold, h5 = text-sm semibold, h6 = text-xs semibold |

```tsx
<Heading level={1} size="text-3xl">
  Bom dia, Marcelo
</Heading>
```

#### Text

| Property | Details |
|----------|---------|
| **Description** | General-purpose text element for body copy, captions, and overlines |
| **Variants** | `body`, `caption`, `overline` |
| **Props** | `size` (type scale token), `color` (`primary` / `secondary` / `muted` / `accent`), `as` (rendered tag, default `<p>`), `children`, `className` |
| **body** | Default text rendering, text-base, color-primary |
| **caption** | text-xs, color-secondary |
| **overline** | text-xs, uppercase, letter-spacing-wider, color-muted |

```tsx
<Text variant="caption" color="secondary">
  Registrado em 27 de fevereiro de 2026
</Text>
```

#### Icon

| Property | Details |
|----------|---------|
| **Description** | Wrapper around Lucide React icons with standardized sizing |
| **Props** | `name` (Lucide icon name string), `size` (`sm` = 16px / `md` = 20px / `lg` = 24px / `xl` = 32px), `aria-hidden` (default `true`), `className` |
| **Accessibility** | Decorative icons: `aria-hidden="true"`. Meaningful icons: provide `aria-label` and set `aria-hidden="false"` |

```tsx
<Icon name="flame" size="lg" className="text-red-500" />
```

#### Badge

| Property | Details |
|----------|---------|
| **Description** | Small status indicator or label |
| **Variants** | `default` (neutral-800 bg), `success` (green bg), `warning` (yellow bg), `danger` (red bg) |
| **Props** | `variant`, `size` (`sm` / `md`), `children`, `className` |
| **Sizes** | `sm`: text-xs, px-1.5, py-0.5 / `md`: text-sm, px-2, py-1 |

```tsx
<Badge variant="danger" size="sm">Intensidade 9</Badge>
```

#### Chip

| Property | Details |
|----------|---------|
| **Description** | Selectable tag for category and option selection |
| **Variants** | `default`, `selected`, `disabled` |
| **Props** | `selected` (boolean), `onSelect` (callback), `icon` (optional Lucide icon name), `disabled`, `children`, `className` |
| **Default** | neutral-800 bg, neutral-500 border, white text |
| **Selected** | red-500 border, red-500/10 bg tint, white text |
| **Disabled** | Reduced opacity, pointer-events none |

```tsx
<Chip
  selected={category === 'audiencia'}
  onSelect={() => setCategory('audiencia')}
  icon="gavel"
>
  Audiencia
</Chip>
```

#### Slider

| Property | Details |
|----------|---------|
| **Description** | Range input for intensity selection (1-10) with gradient track |
| **Props** | `min`, `max`, `value`, `onChange`, `className` |
| **Track** | Gradient from green (#4CAF50) through yellow (#FFC107) to red (#E53935) |
| **Thumb** | White circle, 20px, with shadow and red-500 focus ring |
| **Accessibility** | `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label` |

```tsx
<Slider
  min={1}
  max={10}
  value={intensity}
  onChange={setIntensity}
  aria-label="Intensidade da emocao"
/>
```

---

### 6.2 Molecules

#### FormField

| Property | Details |
|----------|---------|
| **Description** | Composed form element combining label, input/textarea, and error message |
| **Composed Of** | `Label` + `Input` or `Textarea` + error `Text` |
| **Props** | `label`, `required`, `error` (string), `children` (input element), `htmlFor` |
| **Layout** | Vertical stack with spacing-1 between label and input, spacing-1 between input and error |

```tsx
<FormField label="O que aconteceu?" required error={errors.situation}>
  <Textarea rows={4} autoResize placeholder="Descreva a situacao..." />
</FormField>
```

#### CategoryChips

| Property | Details |
|----------|---------|
| **Description** | Horizontally wrapping group of category chips for entry classification |
| **Composed Of** | 7x `Chip` components |
| **Categories** | Audiencia, Negociacao, Cliente, Cobranca, Equipe, Decisao, Outro |
| **Props** | `selected` (string), `onSelect` (callback), `className` |
| **Layout** | `flex flex-wrap gap-2` |
| **Accessibility** | Container: `role="radiogroup"`, `aria-label="Categoria da situacao"` / Each chip: `role="radio"`, `aria-checked` |

#### EmotionPicker

| Property | Details |
|----------|---------|
| **Description** | Grid of emotion options with icon and label |
| **Composed Of** | 7x (`Icon` + `Text`) in a responsive grid |
| **Emotions** | Ansiedade, Raiva, Medo, Frustracao, Inseguranca, Culpa, Outro |
| **Props** | `selected` (string), `onSelect` (callback), `className` |
| **Layout** | `grid grid-cols-3 gap-3` on mobile, `grid-cols-4` on tablet+ |
| **Each Item** | Vertical stack: icon above label, neutral-900 bg card, selected state uses red-500 border |
| **Accessibility** | Container: `role="radiogroup"`, `aria-label="Emocao sentida"` / Each item: `role="radio"`, `aria-checked` |

#### IntensitySlider

| Property | Details |
|----------|---------|
| **Description** | Labeled slider with current value badge for emotional intensity |
| **Composed Of** | `Label` + `Slider` + `Badge` |
| **Props** | `value` (number 1-10), `onChange` (callback), `className` |
| **Badge** | Displays current numeric value; variant changes based on range (success 1-3, warning 4-6, danger 7-10) |
| **Layout** | Label top-left, Badge top-right, Slider full-width below |

#### EntryCard

| Property | Details |
|----------|---------|
| **Description** | Summary card for a past daily entry in history view |
| **Composed Of** | `Chip` (category) + `Icon` (emotion) + `Badge` (intensity) + `Text` (date, excerpt) |
| **Props** | `entry` (DailyEntry object), `onClick` (callback), `className` |
| **Layout** | Horizontal: left side has date + category chip, right side has emotion icon + intensity badge. Below: situation excerpt (truncated to 2 lines) |
| **Background** | neutral-900, hover: neutral-800 transition |

#### StreakCounter

| Property | Details |
|----------|---------|
| **Description** | Visual display of consecutive daily entry count |
| **Composed Of** | `Icon` (flame, in red-500) + `Text` (numeric count in text-4xl bold) + `Text` (label "dias consecutivos") |
| **Props** | `count` (number), `className` |
| **Layout** | Vertical center-aligned stack |
| **Animation** | Subtle scale pulse on count increment (respects prefers-reduced-motion) |

#### SummaryCard

| Property | Details |
|----------|---------|
| **Description** | Metric display card for mentor dashboard overview |
| **Composed Of** | `Text` (label, caption variant) + `Heading` (value, text-2xl bold) |
| **Props** | `label` (string), `value` (string or number), `trend` (optional: up/down/neutral), `className` |
| **Layout** | neutral-900 bg, padding-6, rounded-lg. Label at top, value below |
| **Trend** | Optional colored arrow icon: green up, red down, neutral gray |

#### ReflectionCard

| Property | Details |
|----------|---------|
| **Description** | AI-generated reflection question with optional answer textarea |
| **Composed Of** | `Text` (question, leading-relaxed) + `Textarea` (answer, optional) |
| **Props** | `question` (string), `answer` (string), `onAnswerChange` (callback), `index` (number), `className` |
| **Layout** | neutral-900 bg, padding-6, rounded-lg. Question at top with left red-500 border accent (4px). Textarea below with spacing-4 gap |

---

### 6.3 Organisms

#### DailyEntryForm

| Property | Details |
|----------|---------|
| **Description** | Multi-step wizard for daily entry creation (3 steps) |
| **Composed Of** | Progress bar + Step 1: `FormField` (Textarea) + `CategoryChips` / Step 2: `EmotionPicker` + `IntensitySlider` / Step 3: `FormField` (Textarea) + self-perception chips |
| **Props** | `onSubmit` (callback with entry data), `className` |
| **State** | Internal step management (1, 2, 3), form data accumulation |
| **Progress Bar** | 3 segments, filled segments use red-500, unfilled use neutral-800. `role="progressbar"`, `aria-valuenow` = current step |
| **Navigation** | "Proximo" button advances; "Voltar" link returns. Step 3 has "Salvar" submit button |
| **Screen** | Mentee entry flow (mobile-first) |

#### MenteeHome

| Property | Details |
|----------|---------|
| **Description** | Landing screen for mentees with greeting, streak, and CTA |
| **Composed Of** | `Heading` (contextual greeting) + `StreakCounter` + `Button` ("Registrar o dia") + weekly mini summary bar |
| **Props** | `user` (User), `streak` (number), `weekSummary` (data), `className` |
| **Greeting Logic** | Time-based: "Bom dia" / "Boa tarde" / "Boa noite" + user first name |
| **Layout** | Centered vertical stack, max-width 420px, full viewport height with content centered |
| **Screen** | Mentee home (mobile-first) |

#### MentorSidebar

| Property | Details |
|----------|---------|
| **Description** | Navigation sidebar for mentor dashboard |
| **Composed Of** | Logo/brand mark + nav items (`Icon` + `Text`) + divider + user info section |
| **Props** | `activeRoute` (string), `user` (User), `onNavigate` (callback), `className` |
| **Nav Items** | Visao Geral, Mentorados, Insights do Grupo, Pre-sessao, Meu Diario |
| **Active State** | Red-500 left border accent (3px), red-500/10 bg tint |
| **Width** | 256px fixed on desktop |
| **Collapse** | Below `lg` breakpoint: hamburger toggle, slide-in overlay with backdrop |
| **Screen** | All mentor dashboard screens (desktop-first) |

#### DashboardOverview

| Property | Details |
|----------|---------|
| **Description** | Top-level mentor dashboard with summary metrics and alerts |
| **Composed Of** | 4x `SummaryCard` (grid) + alert list + activity table |
| **Summary Cards** | Mentorados Ativos, Registros Esta Semana, Engajamento Medio, Alertas |
| **Alert List** | Mentees inactive 5+ days, sorted by inactivity duration |
| **Activity Table** | Recent entries across all mentees, with mentee name, date, category, intensity |
| **Layout** | Summary cards: `grid grid-cols-2 lg:grid-cols-4 gap-4`. Alert list and table below in vertical stack |
| **Screen** | Mentor dashboard main view (desktop-first) |

#### AIReflectionView

| Property | Details |
|----------|---------|
| **Description** | Post-entry screen showing AI-generated reflection questions |
| **Composed Of** | Loading spinner (during generation) + N x `ReflectionCard` + action `Button` elements |
| **Props** | `entryId` (string), `questions` (string[]), `loading` (boolean), `onSave` (callback), `onSkip` (callback), `className` |
| **States** | Loading (spinner + "Gerando reflexoes..." text), Loaded (2-3 reflection cards), Error (retry button) |
| **Actions** | "Salvar reflexoes" (primary button, if answers provided) + "Pular" (ghost button) |
| **Layout** | Vertical stack, max-width 560px, centered |
| **Screen** | Post-entry AI reflection (mobile-first) |

---

## 7. Responsive Breakpoints

### Breakpoint Scale

| Name | Min-width | CSS | Target Device |
|------|-----------|-----|---------------|
| `sm` | 640px | `@media (min-width: 640px)` | Large phones (landscape) |
| `md` | 768px | `@media (min-width: 768px)` | Tablets |
| `lg` | 1024px | `@media (min-width: 1024px)` | Small desktops, landscape tablets |
| `xl` | 1280px | `@media (min-width: 1280px)` | Large desktops |

These breakpoints align with Tailwind CSS defaults.

### Responsive Strategy

#### Mentee Screens (Mobile-First)

- **Design baseline:** 375px viewport width.
- **Container:** max-width 560px, centered, with `spacing-4` horizontal padding.
- **Scale-up behavior:** Content area remains constrained; whitespace increases on larger screens.
- **No layout shifts:** Single-column layout at all breakpoints. Only spacing and font sizes may adjust slightly.

#### Mentor Dashboard Screens (Desktop-First)

- **Design baseline:** 1280px viewport width.
- **Layout:** Fixed 256px sidebar + fluid content area.
- **`lg` and above:** Sidebar visible, content fills remaining width.
- **Below `lg`:** Sidebar collapses to a hamburger-triggered slide-in overlay with semi-transparent backdrop.
- **Below `md`:** Summary cards stack to 1 column; tables become horizontally scrollable.

#### Key Responsive Behaviors

| Component | Below `sm` | `sm` - `md` | `md` - `lg` | `lg`+ |
|-----------|-----------|-------------|-------------|-------|
| MentorSidebar | Hamburger overlay | Hamburger overlay | Hamburger overlay | Fixed sidebar |
| DashboardOverview cards | 1 col | 2 cols | 2 cols | 4 cols |
| EmotionPicker grid | 3 cols | 3 cols | 4 cols | 4 cols |
| EntryCard | Stacked layout | Stacked layout | Horizontal layout | Horizontal layout |

---

## 8. Accessibility

### Compliance Target

WCAG 2.1 Level AA across all screens and interactions.

### Color and Contrast

- All text-background combinations meet AA minimum contrast ratios (see Section 3).
- Color is never the sole means of conveying information. Status indicators always pair color with an icon or text label.
- The intensity slider gradient is supplemented by a numeric badge showing the current value.

### Focus Management

- **Focus indicator:** 2px solid `red-500` outline with 2px offset on all interactive elements (`outline: 2px solid #E53935; outline-offset: 2px`).
- **Focus visible only on keyboard:** Use `:focus-visible` to show focus rings only during keyboard navigation, not on mouse click.
- **Focus order:** Follows DOM order, which matches visual order. No `tabindex` values greater than 0.
- **Focus trap:** Modal dialogs and slide-in overlays trap focus within their boundaries. Focus returns to the trigger element on close.

### ARIA Patterns

| Component | ARIA Implementation |
|-----------|-------------------|
| **Slider** | `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label` |
| **CategoryChips** | Container: `role="radiogroup"`, `aria-label`. Each chip: `role="radio"`, `aria-checked` |
| **EmotionPicker** | Container: `role="radiogroup"`, `aria-label`. Each item: `role="radio"`, `aria-checked` |
| **Modal / Overlay** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to heading. Focus trap active. |
| **Progress Bar** | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="1"`, `aria-valuemax="3"`, `aria-label` |
| **Sidebar Nav** | `<nav>` landmark with `aria-label="Menu principal"`. Active item: `aria-current="page"` |
| **Alert List** | `role="alert"` for urgent inactivity warnings. `aria-live="polite"` for dynamic content updates |
| **Loading States** | `aria-busy="true"` on container, `aria-live="polite"` region for status messages |

### Keyboard Navigation

| Element | Tab | Enter / Space | Arrow Keys | Escape |
|---------|-----|--------------|------------|--------|
| Button | Focus | Activate | -- | -- |
| Input | Focus | -- | -- | -- |
| Textarea | Focus | Newline | -- | -- |
| Chip (in group) | Focus group | Select | Navigate within group | -- |
| Emotion (in group) | Focus group | Select | Navigate within group | -- |
| Slider | Focus | -- | Increment/decrement value | -- |
| Sidebar overlay | -- | -- | -- | Close overlay |
| Modal | Focus first element | -- | -- | Close modal |

### Motion

All animations and transitions respect the `prefers-reduced-motion` media query:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Affected animations:
- Streak counter pulse animation
- Sidebar slide-in transition
- Loading spinner rotation
- Button hover/active transitions
- Card hover background transitions

---

## 9. Dark Mode Strategy

### MVP Approach

The MVP ships with **dark mode only**. There is no theme toggle in the UI.

### Implementation

```html
<html class="dark">
  <body class="bg-black text-white">
    ...
  </body>
</html>
```

The `dark` class is applied unconditionally to the `<html>` element. All Tailwind utilities reference the dark palette as the base.

### Future Light Mode Preparation

The token architecture is designed to support a future light mode without refactoring components:

1. **Semantic tokens** serve as the indirection layer. Components reference `bg-primary`, `text-primary`, etc. -- never raw color values.
2. **Token swap strategy:** When light mode is introduced, the semantic layer maps to different core tokens based on the active theme class.
3. **Component tokens** remain stable. `button-primary-bg` always resolves through the semantic layer.

```yaml
# Future light mode example (tokens.yaml)
semantic:
  light:
    bg:
      primary: "{core.color.white}"
      surface: "{core.color.neutral-100}"
    text:
      primary: "{core.color.neutral-900}"
      secondary: "{core.color.neutral-600}"
  dark:
    bg:
      primary: "{core.color.black}"
      surface: "{core.color.neutral-900}"
    text:
      primary: "{core.color.white}"
      secondary: "{core.color.neutral-500}"
```

### Rules

- Components must **never** reference core color tokens directly (e.g., never `text-[#FFFFFF]`). Always use semantic tokens.
- Hardcoded color values in component files are a linting violation.
- The intensity slider gradient is the one exception; its colors are functional (data visualization) and remain constant across themes.

---

## 10. File Structure

```
packages/ui/
├── tokens/
│   ├── tokens.yaml            # Source of truth for all design tokens
│   ├── tokens.css             # Generated CSS custom properties (--color-*, --spacing-*, etc.)
│   ├── tokens.ts              # Generated TypeScript constants with full type definitions
│   └── tokens.tailwind.ts     # Tailwind theme extension config (imported in tailwind.config.ts)
├── lib/
│   ├── utils.ts               # cn() utility — clsx + tailwind-merge composition
│   └── cva.ts                 # class-variance-authority re-export with project defaults
├── atoms/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Label.tsx
│   ├── Heading.tsx
│   ├── Text.tsx
│   ├── Icon.tsx
│   ├── Badge.tsx
│   ├── Chip.tsx
│   └── Slider.tsx
├── molecules/
│   ├── FormField.tsx
│   ├── CategoryChips.tsx
│   ├── EmotionPicker.tsx
│   ├── IntensitySlider.tsx
│   ├── EntryCard.tsx
│   ├── StreakCounter.tsx
│   ├── SummaryCard.tsx
│   └── ReflectionCard.tsx
├── organisms/
│   ├── DailyEntryForm.tsx
│   ├── MenteeHome.tsx
│   ├── MentorSidebar.tsx
│   ├── DashboardOverview.tsx
│   └── AIReflectionView.tsx
├── index.ts                   # Barrel exports for all components
├── package.json
└── tsconfig.json
```

### Conventions

| Convention | Rule |
|------------|------|
| **One component per file** | Each `.tsx` file exports a single named component |
| **Co-located types** | Component prop types defined in the same file |
| **No default exports** | All exports are named for consistent imports |
| **Barrel exports** | `index.ts` re-exports everything; consumers import from `@/ui` |
| **Test co-location** | Tests live in `tests/unit/ui/` mirroring the component structure |
| **Storybook** | Deferred to post-MVP; component catalog lives in this document |

---

## Appendix: Component Dependency Graph

```
Organisms
├── DailyEntryForm
│   ├── CategoryChips ──── Chip
│   ├── EmotionPicker ──── Icon, Text
│   ├── IntensitySlider ── Label, Slider, Badge
│   └── FormField ──────── Label, Input/Textarea, Text
├── MenteeHome
│   ├── Heading
│   ├── StreakCounter ──── Icon, Text
│   └── Button
├── MentorSidebar
│   ├── Icon
│   └── Text
├── DashboardOverview
│   ├── SummaryCard ────── Text, Heading
│   └── (AlertList, ActivityTable — internal)
└── AIReflectionView
    ├── ReflectionCard ─── Text, Textarea
    └── Button
```
