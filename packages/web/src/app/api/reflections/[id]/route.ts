import { NextRequest, NextResponse } from 'next/server';
import { saveReflectionAnswers } from '@/lib/services/reflection-service';
import { requireAuth, sanitizedError } from '@/lib/api/helpers';
import { updateReflectionSchema } from '@/lib/api/schemas';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, supabase, error: authError } = await requireAuth();
    if (authError) return authError;

    const body = await request.json();
    const parsed = updateReflectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { answers } = parsed.data;

    // Verify the reflection belongs to the authenticated user via daily_entries join
    const { data: reflection } = await supabase
      .from('ai_reflections')
      .select('id, daily_entries!inner(user_id)')
      .eq('id', params.id)
      .eq('daily_entries.user_id', user!.id)
      .single();

    if (!reflection) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await saveReflectionAnswers(params.id, answers);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    return sanitizedError(error);
  }
}
