-- Streak calculation function
CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS TABLE(current_streak INT, max_streak INT) AS $$
DECLARE
    v_current_streak INT := 0;
    v_max_streak INT := 0;
    v_streak INT := 0;
    v_prev_date DATE := NULL;
    v_entry RECORD;
BEGIN
    FOR v_entry IN
        SELECT DISTINCT date
        FROM public.daily_entries
        WHERE user_id = p_user_id
        ORDER BY date DESC
    LOOP
        IF v_prev_date IS NULL THEN
            -- First entry: check if it's today or yesterday
            IF v_entry.date >= CURRENT_DATE - INTERVAL '1 day' THEN
                v_streak := 1;
            ELSE
                v_streak := 0;
                EXIT;
            END IF;
        ELSIF v_prev_date - v_entry.date = 1 THEN
            v_streak := v_streak + 1;
        ELSE
            EXIT;
        END IF;

        v_prev_date := v_entry.date;
    END LOOP;

    v_current_streak := v_streak;

    -- Calculate max streak
    v_streak := 0;
    v_prev_date := NULL;
    FOR v_entry IN
        SELECT DISTINCT date
        FROM public.daily_entries
        WHERE user_id = p_user_id
        ORDER BY date ASC
    LOOP
        IF v_prev_date IS NULL THEN
            v_streak := 1;
        ELSIF v_entry.date - v_prev_date = 1 THEN
            v_streak := v_streak + 1;
        ELSE
            IF v_streak > v_max_streak THEN
                v_max_streak := v_streak;
            END IF;
            v_streak := 1;
        END IF;
        v_prev_date := v_entry.date;
    END LOOP;

    IF v_streak > v_max_streak THEN
        v_max_streak := v_streak;
    END IF;

    RETURN QUERY SELECT v_current_streak, v_max_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
