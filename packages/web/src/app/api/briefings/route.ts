import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateAndSaveBriefing } from '@/lib/services/briefing-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'mentor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { mentee_id } = await request.json();
    if (!mentee_id) {
      return NextResponse.json({ error: 'mentee_id is required' }, { status: 400 });
    }

    const briefing = await generateAndSaveBriefing(user.id, mentee_id);
    return NextResponse.json(briefing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
