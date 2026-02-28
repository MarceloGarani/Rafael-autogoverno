import { NextResponse } from 'next/server';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';
import { getMenteesList } from '@/lib/services/dashboard-service';

export async function GET() {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const mentees = await getMenteesList(mentorId!);
    return NextResponse.json(mentees);
  } catch (error) {
    return sanitizedError(error);
  }
}
