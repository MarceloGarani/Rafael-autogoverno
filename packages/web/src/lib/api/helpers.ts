import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function sanitizedError(error: unknown): NextResponse {
  const message = getErrorMessage(error);
  console.error('[API Error]', message);
  return NextResponse.json(
    { error: process.env.NODE_ENV === 'production' ? 'Internal server error' : message },
    { status: 500 }
  );
}

export async function requireAuth() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, supabase, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { user, supabase, error: null };
}

export async function requireMentor() {
  const { user, supabase, error } = await requireAuth();
  if (error || !user) return { user: null, supabase, mentorId: null, error: error! };

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'mentor') {
    return {
      user,
      supabase,
      mentorId: null,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { user, supabase, mentorId: user.id, error: null };
}

export function clampLimit(value: string | null, defaultLimit = 20, max = 100): number {
  const parsed = parseInt(value || String(defaultLimit), 10);
  if (isNaN(parsed) || parsed < 1) return defaultLimit;
  return Math.min(parsed, max);
}
