import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { UserBadge, BadgeType, StreakData } from '@/types/database';

export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch badges: ${error.message}`);
  return data ?? [];
}

export async function awardBadge(
  userId: string,
  badgeType: BadgeType
): Promise<UserBadge | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('badges')
    .upsert(
      { user_id: userId, badge_type: badgeType },
      { onConflict: 'user_id,badge_type' }
    )
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function getUserStreak(userId: string): Promise<StreakData> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('get_user_streak', {
    p_user_id: userId,
  });

  if (error || !data || data.length === 0) {
    return { current_streak: 0, max_streak: 0 };
  }

  return {
    current_streak: data[0].current_streak ?? 0,
    max_streak: data[0].max_streak ?? 0,
  };
}

export async function checkAndAwardBadges(
  userId: string,
  currentStreak: number
): Promise<BadgeType[]> {
  const awarded: BadgeType[] = [];

  if (currentStreak >= 7) {
    const badge = await awardBadge(userId, '7_days');
    if (badge) awarded.push('7_days');
  }
  if (currentStreak >= 30) {
    const badge = await awardBadge(userId, '30_days');
    if (badge) awarded.push('30_days');
  }
  if (currentStreak >= 90) {
    const badge = await awardBadge(userId, '90_days');
    if (badge) awarded.push('90_days');
  }

  // Check perfect week
  const supabase = createServerSupabaseClient();
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const { count } = await supabase
    .from('daily_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('date', monday.toISOString().split('T')[0])
    .lte('date', sunday.toISOString().split('T')[0]);

  if (count && count >= 7) {
    const badge = await awardBadge(userId, 'perfect_week');
    if (badge) awarded.push('perfect_week');
  }

  return awarded;
}
