import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { AIReflection } from '@/types/database';

export async function createReflection(
  entryId: string,
  questions: string[]
): Promise<AIReflection> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ai_reflections')
    .insert({ entry_id: entryId, questions })
    .select()
    .single();

  if (error) throw new Error(`Failed to create reflection: ${error.message}`);
  return data;
}

export async function updateReflectionAnswers(
  reflectionId: string,
  answers: (string | null)[]
): Promise<AIReflection> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ai_reflections')
    .update({ answers })
    .eq('id', reflectionId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update reflection: ${error.message}`);
  return data;
}

export async function getReflectionByEntryId(
  entryId: string
): Promise<AIReflection | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('ai_reflections')
    .select('*')
    .eq('entry_id', entryId)
    .single();

  if (error) return null;
  return data;
}
