import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { MentorNote } from '@/types/database';

export async function getMentorNote(
  mentorId: string,
  menteeId: string
): Promise<MentorNote | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('mentor_notes')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('mentee_id', menteeId)
    .single();

  if (error) return null;
  return data;
}

export async function upsertMentorNote(
  mentorId: string,
  menteeId: string,
  content: string
): Promise<MentorNote> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('mentor_notes')
    .upsert(
      {
        mentor_id: mentorId,
        mentee_id: menteeId,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'mentor_id,mentee_id' }
    )
    .select()
    .single();

  if (error) throw new Error(`Failed to upsert note: ${error.message}`);
  return data;
}
