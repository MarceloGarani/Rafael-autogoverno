import { NextResponse } from 'next/server';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';
import { getDashboardOverview } from '@/lib/services/dashboard-service';

export async function GET() {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const overview = await getDashboardOverview(mentorId!);
    return NextResponse.json(overview);
  } catch (error) {
    return sanitizedError(error);
  }
}
