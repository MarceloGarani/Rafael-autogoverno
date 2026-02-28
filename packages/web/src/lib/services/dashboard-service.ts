import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Compute the current streak (consecutive days with entries) from a list of entries.
 * Entries must have a `date` field (YYYY-MM-DD string).
 * Returns 0 if the most recent entry is older than yesterday.
 */
function computeStreak(entries: { date: string }[]): number {
  if (entries.length === 0) return 0;
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dates[0] < yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i - 1]);
    const prev = new Date(dates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / 86400000;
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
}

export async function getDashboardOverview(mentorId: string) {
  const supabase = createServerSupabaseClient();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

  // Run all independent queries in parallel (4 queries total, no N+1)
  const [
    { count: totalMentees },
    { count: entriesThisWeek },
    { data: mentees },
    { data: recentActivity },
  ] = await Promise.all([
    // 1. Total mentees
    supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'mentee'),
    // 2. Entries this week (excluding mentor's own)
    supabase
      .from('daily_entries')
      .select('*', { count: 'exact', head: true })
      .neq('user_id', mentorId)
      .gte('date', weekAgoStr),
    // 3. All mentees with their entries (bulk fetch via join)
    supabase
      .from('users')
      .select('id, name')
      .eq('role', 'mentee'),
    // 4. Recent activity
    supabase
      .from('daily_entries')
      .select('id, date, category, emotion, intensity, user_id, users!inner(name)')
      .neq('user_id', mentorId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  // Fetch all mentee entries in one bulk query to compute engagement + alerts
  const menteeIds = (mentees ?? []).map((m: any) => m.id);
  let allMenteeEntries: any[] = [];
  if (menteeIds.length > 0) {
    const { data } = await supabase
      .from('daily_entries')
      .select('user_id, date')
      .in('user_id', menteeIds)
      .order('date', { ascending: false });
    allMenteeEntries = data ?? [];
  }

  // Group entries by user_id
  const entriesByUser = new Map<string, { date: string }[]>();
  for (const entry of allMenteeEntries) {
    if (!entriesByUser.has(entry.user_id)) {
      entriesByUser.set(entry.user_id, []);
    }
    entriesByUser.get(entry.user_id)!.push({ date: entry.date });
  }

  // Engagement: mentees who registered in last 2 days
  const uniqueActive = new Set(
    allMenteeEntries
      .filter((e: any) => e.date >= twoDaysAgoStr)
      .map((e: any) => e.user_id)
  ).size;
  const engagementPct = totalMentees ? Math.round((uniqueActive / totalMentees) * 100) : 0;

  // Alerts: mentees inactive 3+ days (computed from grouped entries, no per-mentee queries)
  const alerts: { id: string; menteeName: string; daysInactive: number }[] = [];
  if (mentees) {
    for (const mentee of mentees) {
      const userEntries = entriesByUser.get(mentee.id);
      const lastDate = userEntries?.[0]?.date; // already sorted desc
      const daysInactive = lastDate
        ? Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysInactive >= 3) {
        alerts.push({ id: mentee.id, menteeName: mentee.name, daysInactive });
      }
    }
    alerts.sort((a, b) => b.daysInactive - a.daysInactive);
  }

  return {
    total_mentees: totalMentees ?? 0,
    entries_this_week: entriesThisWeek ?? 0,
    engagement_pct: engagementPct,
    alerts_count: alerts.length,
    alerts,
    recent_activity: (recentActivity ?? []).map((a: any) => ({
      id: a.id,
      date: a.date,
      menteeName: a.users?.name ?? 'Desconhecido',
      category: a.category,
      emotion: a.emotion,
      intensity: a.intensity,
    })),
  };
}

export async function getMenteesList(mentorId: string) {
  const supabase = createServerSupabaseClient();

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split('T')[0];

  // 1. Fetch all mentees in one query
  const { data: mentees } = await supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('role', 'mentee');

  if (!mentees || mentees.length === 0) return [];

  const menteeIds = mentees.map(m => m.id);

  // 2 & 3. Fetch all entries for all mentees in parallel (2 queries total)
  const [
    { data: recentEntries },
    { data: streakEntries },
  ] = await Promise.all([
    // Recent entries (last 7 days) for avg intensity computation
    supabase
      .from('daily_entries')
      .select('user_id, date, intensity')
      .in('user_id', menteeIds)
      .gte('date', weekAgoStr)
      .order('date', { ascending: false }),
    // Entries for streak computation (last 90 days)
    supabase
      .from('daily_entries')
      .select('user_id, date')
      .in('user_id', menteeIds)
      .gte('date', ninetyDaysAgoStr)
      .order('date', { ascending: false }),
  ]);

  // Group recent entries by user_id (for avg intensity + last entry date)
  const recentByUser = new Map<string, { date: string; intensity: number }[]>();
  for (const entry of (recentEntries ?? [])) {
    if (!recentByUser.has(entry.user_id)) {
      recentByUser.set(entry.user_id, []);
    }
    recentByUser.get(entry.user_id)!.push({ date: entry.date, intensity: entry.intensity });
  }

  // Group streak entries by user_id (for streak computation + last entry date)
  const streakByUser = new Map<string, { date: string }[]>();
  for (const entry of (streakEntries ?? [])) {
    if (!streakByUser.has(entry.user_id)) {
      streakByUser.set(entry.user_id, []);
    }
    streakByUser.get(entry.user_id)!.push({ date: entry.date });
  }

  // Build result in JS — no per-mentee queries
  const result = mentees.map(mentee => {
    // Last entry date from streak entries (sorted desc, covers 90 days)
    const userStreakEntries = streakByUser.get(mentee.id) ?? [];
    const lastEntryDate = userStreakEntries.length > 0 ? userStreakEntries[0].date : null;
    const daysInactive = lastEntryDate
      ? Math.floor((Date.now() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Status
    let status: 'active' | 'absent' | 'inactive';
    if (daysInactive <= 2) status = 'active';
    else if (daysInactive <= 5) status = 'absent';
    else status = 'inactive';

    // Streak (computed in JS instead of RPC)
    const streak = computeStreak(userStreakEntries);

    // Avg intensity this week
    const weekEntries = recentByUser.get(mentee.id) ?? [];
    const avgIntensity = weekEntries.length > 0
      ? weekEntries.reduce((s, e) => s + e.intensity, 0) / weekEntries.length
      : 0;

    return {
      id: mentee.id,
      name: mentee.name,
      email: mentee.email,
      created_at: mentee.created_at,
      last_entry_date: lastEntryDate,
      streak,
      avg_intensity_week: Math.round(avgIntensity * 10) / 10,
      status,
      days_inactive: daysInactive,
    };
  });

  // Sort: inactive first
  result.sort((a, b) => {
    const statusOrder = { inactive: 0, absent: 1, active: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return b.days_inactive - a.days_inactive;
  });

  return result;
}

export async function getMenteeProfile(mentorId: string, menteeId: string) {
  const supabase = createServerSupabaseClient();

  const { data: mentee } = await supabase
    .from('users')
    .select('*')
    .eq('id', menteeId)
    .eq('role', 'mentee')
    .single();

  if (!mentee) return null;

  const { data: streakData } = await supabase.rpc('get_user_streak', { p_user_id: menteeId });
  const { count: totalEntries } = await supabase
    .from('daily_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', menteeId);

  return {
    ...mentee,
    streak: streakData?.[0]?.current_streak ?? 0,
    max_streak: streakData?.[0]?.max_streak ?? 0,
    total_entries: totalEntries ?? 0,
  };
}

export async function getMenteeEntries(menteeId: string, page = 1, limit = 20) {
  const supabase = createServerSupabaseClient();
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from('daily_entries')
    .select('*, ai_reflections(*)', { count: 'exact' })
    .eq('user_id', menteeId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new Error(`Failed to fetch entries: ${error.message}`);

  return {
    entries: (data ?? []).map((e: any) => ({
      ...e,
      ai_reflections: e.ai_reflections?.[0] ?? null,
    })),
    total: count ?? 0,
  };
}

export async function getGroupInsights(mentorId: string, period: 'week' | 'month' = 'week') {
  const supabase = createServerSupabaseClient();

  const startDate = new Date();
  if (period === 'week') startDate.setDate(startDate.getDate() - 7);
  else startDate.setMonth(startDate.getMonth() - 1);

  const dateStr = startDate.toISOString().split('T')[0];

  // Top emotions
  const { data: entries } = await supabase
    .from('daily_entries')
    .select('emotion, category, intensity, self_perception')
    .neq('user_id', mentorId)
    .gte('date', dateStr);

  if (!entries || entries.length === 0) {
    return {
      top_emotions: [],
      top_category: null,
      avg_intensity_current: 0,
      avg_intensity_previous: 0,
      reactive_vs_strategic: { reactive: 0, strategic: 0, unsure: 0 },
      total_entries: 0,
    };
  }

  // Emotion counts
  const emotionCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  let totalIntensity = 0;
  let reactiveCount = 0;
  let strategicCount = 0;
  let unsureCount = 0;

  for (const e of entries) {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    totalIntensity += e.intensity;
    if (e.self_perception === 'reactive') reactiveCount++;
    else if (e.self_perception === 'strategic') strategicCount++;
    else unsureCount++;
  }

  const topEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: Math.round((count / entries.length) * 100),
    }));

  const topCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0];

  // Previous period avg
  const prevStartDate = new Date(startDate);
  if (period === 'week') prevStartDate.setDate(prevStartDate.getDate() - 7);
  else prevStartDate.setMonth(prevStartDate.getMonth() - 1);

  const { data: prevEntries } = await supabase
    .from('daily_entries')
    .select('intensity')
    .neq('user_id', mentorId)
    .gte('date', prevStartDate.toISOString().split('T')[0])
    .lt('date', dateStr);

  const prevAvgIntensity = prevEntries && prevEntries.length > 0
    ? prevEntries.reduce((s: number, e: any) => s + e.intensity, 0) / prevEntries.length
    : 0;

  return {
    top_emotions: topEmotions,
    top_category: topCategory ? { category: topCategory[0], count: topCategory[1], percentage: Math.round((topCategory[1] / entries.length) * 100) } : null,
    avg_intensity_current: Math.round((totalIntensity / entries.length) * 10) / 10,
    avg_intensity_previous: Math.round(prevAvgIntensity * 10) / 10,
    reactive_vs_strategic: {
      reactive: Math.round((reactiveCount / entries.length) * 100),
      strategic: Math.round((strategicCount / entries.length) * 100),
      unsure: Math.round((unsureCount / entries.length) * 100),
    },
    total_entries: entries.length,
  };
}
