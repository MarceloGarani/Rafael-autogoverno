import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { generateAndSaveWeeklyReport } from '@/lib/services/report-service';

export async function POST(request: NextRequest) {
  try {
    // Check if cron call
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret === process.env.CRON_SECRET && cronSecret) {
      // Generate for all users
      const serviceClient = createServiceRoleClient();
      const { data: users } = await serviceClient
        .from('users')
        .select('id')
        .in('role', ['mentee', 'mentor']);

      const results = [];
      for (const user of users ?? []) {
        try {
          const report = await generateAndSaveWeeklyReport(user.id);
          results.push({ user_id: user.id, status: 'ok', report_id: report.id });
        } catch (e: any) {
          results.push({ user_id: user.id, status: 'error', message: e.message });
        }
      }

      return NextResponse.json({ results });
    }

    // Manual generation
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const report = await generateAndSaveWeeklyReport(user.id);
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
