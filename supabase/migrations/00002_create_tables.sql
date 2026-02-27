-- Users (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'mentee',
    reminder_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily Entries
CREATE TABLE public.daily_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    situation TEXT NOT NULL,
    category entry_category NOT NULL,
    emotion entry_emotion NOT NULL,
    intensity INTEGER NOT NULL CHECK (intensity >= 1 AND intensity <= 10),
    reaction TEXT NOT NULL,
    self_perception self_perception_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, date)
);

-- AI Reflections
CREATE TABLE public.ai_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL UNIQUE REFERENCES public.daily_entries(id) ON DELETE CASCADE,
    questions JSONB NOT NULL,
    answers JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Weekly Reports
CREATE TABLE public.weekly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    summary TEXT NOT NULL,
    patterns JSONB NOT NULL DEFAULT '[]',
    evolution JSONB NOT NULL DEFAULT '{}',
    insight TEXT NOT NULL DEFAULT '',
    challenge TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, week_start)
);

-- Mentor Notes
CREATE TABLE public.mentor_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(mentor_id, mentee_id)
);

-- Session Briefings
CREATE TABLE public.session_briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    summary TEXT NOT NULL,
    patterns JSONB NOT NULL DEFAULT '[]',
    suggested_topics JSONB NOT NULL DEFAULT '[]',
    suggested_questions JSONB NOT NULL DEFAULT '[]',
    mentor_previous_notes TEXT
);

-- Badges
CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    badge_type badge_type NOT NULL,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, badge_type)
);

-- Indexes
CREATE INDEX idx_daily_entries_user_date ON public.daily_entries(user_id, date DESC);
CREATE INDEX idx_daily_entries_user_category ON public.daily_entries(user_id, category);
CREATE INDEX idx_daily_entries_user_emotion ON public.daily_entries(user_id, emotion);
CREATE INDEX idx_weekly_reports_user ON public.weekly_reports(user_id, week_start DESC);
CREATE INDEX idx_session_briefings_mentee ON public.session_briefings(mentee_id, generated_at DESC);
CREATE INDEX idx_badges_user ON public.badges(user_id);
