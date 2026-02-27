import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getMenteeProfile } from '@/lib/services/dashboard-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const menteeProfile = await getMenteeProfile(user.id, params.id);
    if (!menteeProfile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(menteeProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
