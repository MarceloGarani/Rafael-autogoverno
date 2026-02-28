import { NextRequest, NextResponse } from 'next/server';
import { getMentorNote, upsertMentorNote } from '@/lib/db/mentor-notes';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';

export async function GET(
  _request: NextRequest,
  { params }: { params: { menteeId: string } }
) {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const note = await getMentorNote(mentorId!, params.menteeId);
    return NextResponse.json(note || { content: '' });
  } catch (error: unknown) {
    return sanitizedError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { menteeId: string } }
) {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const { content } = await request.json();
    const note = await upsertMentorNote(mentorId!, params.menteeId, content);
    return NextResponse.json(note);
  } catch (error: unknown) {
    return sanitizedError(error);
  }
}
