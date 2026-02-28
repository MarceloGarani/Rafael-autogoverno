import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, sanitizedError } from '@/lib/api/helpers';
import { fetchReportById } from '@/lib/services/report-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await requireAuth();
    if (error) return error;

    const report = await fetchReportById(params.id);
    if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (report.user_id !== user!.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return NextResponse.json(report);
  } catch (error) {
    return sanitizedError(error);
  }
}
