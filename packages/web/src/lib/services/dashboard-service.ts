import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getDashboardOverview(mentorId: string) {
  const supabase = createServerSupabaseClient();

  // Total mentees
  const { count: totalMentees } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'mentee');

  // Entries this week (excluding mentor's own)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count: entriesThisWeek } = await supabase
    .from('daily_entries')
    .select('*', { count: 'exact', head: true })
    .neq('user_id', mentorId)
    .gte('date', weekAgo.toISOString().split('T')[0]);

  // Engagement: mentees who registered in last 2 days
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const { data: activeUsers } = await supabase
    .from('daily_entries')
    .select('user_id')
    .neq('user_id', mentorId)
    .gte('date', twoDaysAgo.toISOString().split('T')[0]);
  const uniqueActive = new Set(activeUsers?.map((u: any) => u.user_id)).size;
  const engagementPct = totalMentees ? Math.round((uniqueActive / totalMentees) * 100) : 0;

  // Alerts: mentees inactive 3+ days
  const { data: mentees } = await supabase
    .from('users')
    .select('id, name')
    .eq('role', 'mentee');

  const alerts: { id: string; menteeName: string; daysInactive: number }[] = [];
  if (mentees) {
    for (const mentee of mentees) {
      const { data: lastEntry } = await supabase
        .from('daily_entries')
        .select('date')
        .eq('user_id', mentee.id)
        .order('date', { ascending: false })
        .limit(1);

      const lastDate = lastEntry?.[0]?.date;
      const daysInactive = lastDate
        ? Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (daysInactive >= 3) {
        alerts.push({ id: mentee.id, menteeName: mentee.name, daysInactive });
      }
    }
    alerts.sort((a, b) => b.daysInactive - a.daysInactive);
  }

  // Recent activity
  const { data: recentActivity } = await supabase
    .from('daily_entries')
    .select('id, date, category, emotion, intensity, user_id, users!inner(name)')
    .neq('user_id', mentorId)
    .order('created_at', { ascending: false })
    .limit(10);

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

  const { data: mentees } = await supabase
    .from('users')
    .select('id, name, email, created_at')
    .eq('role', 'mentee');

  if (!mentees) return [];

  const result = [];
  for (const mentee of mentees) {
    // Last entry
    const { data: lastEntry } = await supabase
      .from('daily_entries')
      .select('date')
      .eq('user_id', mentee.id)
      .order('date', { ascending: false })
      .limit(1);

    const lastEntryDate = lastEntry?.[0]?.date ?? null;
    const daysInactive = lastEntryDate
      ? Math.floor((Date.now() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Status
    let status: 'active' | 'absent' | 'inactive';
    if (daysInactive <= 2) status = 'active';
    else if (daysInactive <= 5) status = 'absent';
    else status = 'inactive';

    // Streak
    const { data: streakData } = await supabase.rpc('get_user_streak', { p_user_id: mentee.id });
    const streak = streakData?.[0]?.current_streak ?? 0;

    // Avg intensity this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weekEntries } = await supabase
      .from('daily_entries')
      .select('intensity')
      .eq('user_id', mentee.id)
      .gte('date', weekAgo.toISOString().split('T')[0]);

    const avgIntensity = weekEntries && weekEntries.length > 0
      ? weekEntries.reduce((s: number, e: any) => s + e.intensity, 0) / weekEntries.length
      : 0;

    result.push({
      id: mentee.id,
      name: mentee.name,
      email: mentee.email,
      created_at: mentee.created_at,
      last_entry_date: lastEntryDate,
      streak,
      avg_intensity_week: Math.round(avgIntensity * 10) / 10,
      status,
      days_inactive: daysInactive,
    });
  }

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
