import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { saveReflectionAnswers } from '@/lib/services/reflection-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { answers } = await request.json();
    const reflection = await saveReflectionAnswers(params.id, answers);
    return NextResponse.json(reflection);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
