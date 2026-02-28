import { NextRequest, NextResponse } from 'next/server';
import { requireMentor, sanitizedError, clampLimit } from '@/lib/api/helpers';
import { getMenteeEntries } from '@/lib/services/dashboard-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await requireMentor();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = clampLimit(searchParams.get('limit'));

    const result = await getMenteeEntries(params.id, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    return sanitizedError(error);
  }
}
