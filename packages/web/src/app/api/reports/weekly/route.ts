import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { requireAuth, sanitizedError, getErrorMessage } from '@/lib/api/helpers';
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
        } catch (e) {
          results.push({ user_id: user.id, status: 'error', message: getErrorMessage(e) });
        }
      }

      return NextResponse.json({ results });
    }

    // Manual generation
    const { user, error } = await requireAuth();
    if (error) return error;

    const report = await generateAndSaveWeeklyReport(user!.id);
    return NextResponse.json(report);
  } catch (error) {
    return sanitizedError(error);
  }
}
