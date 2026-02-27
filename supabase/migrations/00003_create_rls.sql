-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Users: can read own profile
CREATE POLICY "users_read_own" ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Users: mentor can read all mentees
CREATE POLICY "mentor_read_mentees" ON public.users FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'mentor')
        AND role = 'mentee'
    );

-- Users: can update own profile
CREATE POLICY "users_update_own" ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Users: can insert own profile (registration)
CREATE POLICY "users_insert_own" ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Daily Entries: own data read
CREATE POLICY "entries_own_read" ON public.daily_entries FOR SELECT
    USING (auth.uid() = user_id);

-- Daily Entries: own data insert
CREATE POLICY "entries_own_insert" ON public.daily_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Daily Entries: mentor read mentee entries (NOT own)
CREATE POLICY "mentor_read_mentee_entries" ON public.daily_entries FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'mentor')
        AND user_id != auth.uid()
    );

-- AI Reflections: via entry ownership
CREATE POLICY "reflections_own_read" ON public.ai_reflections FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.daily_entries WHERE id = entry_id AND user_id = auth.uid())
    );

CREATE POLICY "reflections_own_insert" ON public.ai_reflections FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.daily_entries WHERE id = entry_id AND user_id = auth.uid())
    );

CREATE POLICY "reflections_own_update" ON public.ai_reflections FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM public.daily_entries WHERE id = entry_id AND user_id = auth.uid())
    );

-- AI Reflections: mentor can read mentee reflections
CREATE POLICY "mentor_read_mentee_reflections" ON public.ai_reflections FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.daily_entries de
            JOIN public.users u ON u.id = auth.uid()
            WHERE de.id = entry_id AND u.role = 'mentor' AND de.user_id != auth.uid()
        )
    );

-- Weekly Reports: own data
CREATE POLICY "reports_own_read" ON public.weekly_reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "reports_own_insert" ON public.weekly_reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Weekly Reports: mentor read mentee reports
CREATE POLICY "mentor_read_mentee_reports" ON public.weekly_reports FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'mentor')
        AND user_id != auth.uid()
    );

-- Mentor Notes: mentor can manage own notes
CREATE POLICY "mentor_notes_own" ON public.mentor_notes FOR ALL
    USING (auth.uid() = mentor_id);

-- Session Briefings: mentor can manage
CREATE POLICY "briefings_mentor" ON public.session_briefings FOR ALL
    USING (auth.uid() = mentor_id);

-- Badges: own data
CREATE POLICY "badges_own_read" ON public.badges FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "badges_own_insert" ON public.badges FOR INSERT
    WITH CHECK (auth.uid() = user_id);
