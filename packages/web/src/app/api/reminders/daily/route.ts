import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { sanitizedError, getErrorMessage } from '@/lib/api/helpers';
import { sendReminderEmail } from '@/lib/services/email-service';

export async function POST(request: NextRequest) {
  try {
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const today = new Date().toISOString().split('T')[0];

    // Get mentees who haven't registered today and have reminders enabled
    const { data: mentees } = await supabase
      .from('users')
      .select('id, name, email, reminder_enabled')
      .eq('role', 'mentee')
      .eq('reminder_enabled', true);

    const results = [];
    for (const mentee of mentees ?? []) {
      // Check if already registered today
      const { count } = await supabase
        .from('daily_entries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', mentee.id)
        .eq('date', today);

      if (count === 0) {
        try {
          await sendReminderEmail(mentee.email, mentee.name);
          results.push({ user_id: mentee.id, status: 'sent' });
        } catch (e) {
          results.push({ user_id: mentee.id, status: 'error', message: getErrorMessage(e) });
        }
      } else {
        results.push({ user_id: mentee.id, status: 'skipped' });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return sanitizedError(error);
  }
}
