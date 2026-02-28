import { NextRequest, NextResponse } from 'next/server';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';
import { getGroupInsights } from '@/lib/services/dashboard-service';

export async function GET(request: NextRequest) {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as 'week' | 'month') || 'week';

    const insights = await getGroupInsights(mentorId!, period);
    return NextResponse.json(insights);
  } catch (error) {
    return sanitizedError(error);
  }
}
