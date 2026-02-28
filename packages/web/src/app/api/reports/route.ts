import { NextResponse } from 'next/server';
import { requireAuth, sanitizedError } from '@/lib/api/helpers';
import { fetchUserReports } from '@/lib/services/report-service';

export async function GET() {
  try {
    const { user, error } = await requireAuth();
    if (error) return error;

    const reports = await fetchUserReports(user!.id);
    return NextResponse.json(reports);
  } catch (error) {
    return sanitizedError(error);
  }
}
