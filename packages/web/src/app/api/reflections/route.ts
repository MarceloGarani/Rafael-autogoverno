import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateAndSaveReflection } from '@/lib/services/reflection-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { entry_id } = await request.json();
    if (!entry_id) {
      return NextResponse.json({ error: 'entry_id is required' }, { status: 400 });
    }

    const reflection = await generateAndSaveReflection(entry_id);
    return NextResponse.json({ id: reflection.id, questions: reflection.questions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
