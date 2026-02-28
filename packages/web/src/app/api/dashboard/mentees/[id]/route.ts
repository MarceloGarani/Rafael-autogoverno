import { NextRequest, NextResponse } from 'next/server';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';
import { getMenteeProfile } from '@/lib/services/dashboard-service';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const menteeProfile = await getMenteeProfile(mentorId!, params.id);
    if (!menteeProfile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(menteeProfile);
  } catch (error) {
    return sanitizedError(error);
  }
}
