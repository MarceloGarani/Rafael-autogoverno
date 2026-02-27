import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { WeeklyReport } from '@/types/database';

export async function createWeeklyReport(
  report: Omit<WeeklyReport, 'id' | 'created_at'>
): Promise<WeeklyReport> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weekly_reports')
    .insert(report)
    .select()
    .single();

  if (error) throw new Error(`Failed to create report: ${error.message}`);
  return data;
}

export async function getWeeklyReports(userId: string): Promise<WeeklyReport[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false });

  if (error) throw new Error(`Failed to fetch reports: ${error.message}`);
  return data ?? [];
}

export async function getWeeklyReportById(
  reportId: string
): Promise<WeeklyReport | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (error) return null;
  return data;
}
