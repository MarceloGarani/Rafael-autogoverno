import { NextRequest, NextResponse } from 'next/server';
import { generateAndSaveReflection } from '@/lib/services/reflection-service';
import { requireAuth, sanitizedError } from '@/lib/api/helpers';
import { createReflectionSchema } from '@/lib/api/schemas';

export async function POST(request: NextRequest) {
  try {
    const { user, supabase, error: authError } = await requireAuth();
    if (authError) return authError;

    const body = await request.json();
    const parsed = createReflectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { entry_id } = parsed.data;

    // Verify the entry belongs to the authenticated user
    const { data: entry } = await supabase
      .from('daily_entries')
      .select('id')
      .eq('id', entry_id)
      .eq('user_id', user!.id)
      .single();

    if (!entry) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reflection = await generateAndSaveReflection(entry_id);
    return NextResponse.json({ id: reflection.id, questions: reflection.questions });
  } catch (error: unknown) {
    return sanitizedError(error);
  }
}
