import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, sanitizedError } from '@/lib/api/helpers';
import { getUserStreak, getUserBadges } from '@/lib/db/badges';
import { getEntryCount } from '@/lib/db/entries';

export async function GET(request: NextRequest) {
  try {
    const { user, supabase, error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    const startDate = new Date();
    if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else if (period === '3months') startDate.setMonth(startDate.getMonth() - 3);
    else startDate.setFullYear(2020);

    const { data: entries } = await supabase
      .from('daily_entries')
      .select('date, intensity, category, emotion, self_perception')
      .eq('user_id', user!.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Intensity by week
    const weekMap = new Map<string, number[]>();
    for (const e of entries ?? []) {
      const d = new Date(e.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toISOString().split('T')[0];
      if (!weekMap.has(key)) weekMap.set(key, []);
      weekMap.get(key)!.push(e.intensity);
    }
    const intensityByWeek = Array.from(weekMap.entries()).map(([week, intensities]) => ({
      week,
      avg_intensity: Math.round((intensities.reduce((a, b) => a + b, 0) / intensities.length) * 10) / 10,
    }));

    // Category distribution
    const catCounts: Record<string, number> = {};
    for (const e of entries ?? []) {
      catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    }
    const total = entries?.length ?? 1;
    const categoryDistribution = Object.entries(catCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / total) * 100),
    }));

    // Reactive vs Strategic by month
    const monthMap = new Map<string, { reactive: number; strategic: number; unsure: number; total: number }>();
    for (const e of entries ?? []) {
      const month = e.date.substring(0, 7);
      if (!monthMap.has(month)) monthMap.set(month, { reactive: 0, strategic: 0, unsure: 0, total: 0 });
      const m = monthMap.get(month)!;
      m.total++;
      if (e.self_perception === 'reactive') m.reactive++;
      else if (e.self_perception === 'strategic') m.strategic++;
      else m.unsure++;
    }
    const reactiveVsStrategic = Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      reactive_pct: Math.round((data.reactive / data.total) * 100),
      strategic_pct: Math.round((data.strategic / data.total) * 100),
      unsure_pct: Math.round((data.unsure / data.total) * 100),
    }));

    const streak = await getUserStreak(user!.id);
    const badges = await getUserBadges(user!.id);
    const totalEntries = await getEntryCount(user!.id);

    return NextResponse.json({
      intensity_by_week: intensityByWeek,
      category_distribution: categoryDistribution,
      reactive_vs_strategic: reactiveVsStrategic,
      streak: streak.current_streak,
      max_streak: streak.max_streak,
      total_entries: totalEntries,
      badges,
    });
  } catch (error) {
    return sanitizedError(error);
  }
}
