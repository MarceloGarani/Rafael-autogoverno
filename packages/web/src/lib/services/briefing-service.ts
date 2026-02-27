import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateBriefing } from '@/lib/ai/generate';
import { getMentorNote } from '@/lib/db/mentor-notes';
import type { SessionBriefing } from '@/types/database';

export async function generateAndSaveBriefing(
  mentorId: string,
  menteeId: string
): Promise<SessionBriefing> {
  const supabase = createServerSupabaseClient();

  // Get last briefing date
  const { data: lastBriefing } = await supabase
    .from('session_briefings')
    .select('generated_at')
    .eq('mentor_id', mentorId)
    .eq('mentee_id', menteeId)
    .order('generated_at', { ascending: false })
    .limit(1);

  const sinceDate = lastBriefing?.[0]?.generated_at
    ? new Date(lastBriefing[0].generated_at).toISOString().split('T')[0]
    : '2020-01-01';

  // Get entries since last briefing
  const { data: entries } = await supabase
    .from('daily_entries')
    .select('*, ai_reflections(*)')
    .eq('user_id', menteeId)
    .gte('date', sinceDate)
    .order('date', { ascending: true });

  const entriesWithReflections = (entries ?? []).map((e: any) => ({
    ...e,
    ai_reflections: e.ai_reflections?.[0] ?? null,
  }));

  // Get mentor notes
  const mentorNote = await getMentorNote(mentorId, menteeId);

  // Generate briefing
  const aiBriefing = await generateBriefing(entriesWithReflections, mentorNote?.content ?? null);

  // Save
  const { data, error } = await supabase
    .from('session_briefings')
    .insert({
      mentor_id: mentorId,
      mentee_id: menteeId,
      summary: aiBriefing.summary || 'Resumo indisponível.',
      patterns: aiBriefing.patterns || [],
      suggested_topics: aiBriefing.suggested_topics || [],
      suggested_questions: aiBriefing.suggested_questions || [],
      mentor_previous_notes: mentorNote?.content ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to save briefing: ${error.message}`);
  return data;
}

export async function getBriefingHistory(mentorId: string, menteeId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('session_briefings')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('mentee_id', menteeId)
    .order('generated_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch briefings: ${error.message}`);
  return data ?? [];
}
