import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getUserStreak } from '@/lib/db/badges';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const streak = await getUserStreak(user.id);
    return NextResponse.json(streak);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
