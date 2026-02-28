import { NextRequest, NextResponse } from 'next/server';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';
import { getBriefingHistory } from '@/lib/services/briefing-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: { menteeId: string } }
) {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const briefings = await getBriefingHistory(mentorId!, params.menteeId);
    return NextResponse.json(briefings);
  } catch (error) {
    return sanitizedError(error);
  }
}
