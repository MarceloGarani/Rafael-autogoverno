import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { DailyEntry, DailyEntryWithReflection, EntryCategory, EntryEmotion } from '@/types/database';

export async function createEntry(
  userId: string,
  data: {
    date: string;
    situation: string;
    category: EntryCategory;
    emotion: EntryEmotion;
    intensity: number;
    reaction: string;
    self_perception: string;
  }
): Promise<DailyEntry> {
  const supabase = createServerSupabaseClient();
  const { data: entry, error } = await supabase
    .from('daily_entries')
    .insert({ user_id: userId, ...data })
    .select()
    .single();

  if (error) throw new Error(`Failed to create entry: ${error.message}`);
  return entry;
}

export async function getEntries(
  userId: string,
  filters?: {
    period?: 'week' | 'month' | 'custom';
    start_date?: string;
    end_date?: string;
    category?: EntryCategory;
    emotion?: EntryEmotion;
    page?: number;
    limit?: number;
  }
): Promise<{ entries: DailyEntryWithReflection[]; total: number }> {
  const supabase = createServerSupabaseClient();
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('daily_entries')
    .select('*, ai_reflections(*)', { count: 'exact' })
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters?.category) query = query.eq('category', filters.category);
  if (filters?.emotion) query = query.eq('emotion', filters.emotion);

  if (filters?.period === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    query = query.gte('date', weekAgo.toISOString().split('T')[0]);
  } else if (filters?.period === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    query = query.gte('date', monthAgo.toISOString().split('T')[0]);
  } else if (filters?.start_date && filters?.end_date) {
    query = query.gte('date', filters.start_date).lte('date', filters.end_date);
  }

  const { data, count, error } = await query;
  if (error) throw new Error(`Failed to fetch entries: ${error.message}`);

  return {
    entries: (data ?? []).map((e: any) => ({
      ...e,
      ai_reflections: e.ai_reflections?.[0] ?? null,
    })),
    total: count ?? 0,
  };
}

export async function getEntriesByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailyEntry[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw new Error(`Failed to fetch entries: ${error.message}`);
  return data ?? [];
}

export async function getEntryById(entryId: string): Promise<DailyEntry | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (error) return null;
  return data;
}

export async function getLast7DaysEntries(userId: string): Promise<DailyEntry[]> {
  const supabase = createServerSupabaseClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', weekAgo.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw new Error(`Failed to fetch entries: ${error.message}`);
  return data ?? [];
}

export async function getEntryCount(userId: string): Promise<number> {
  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from('daily_entries')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) return 0;
  return count ?? 0;
}
