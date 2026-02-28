import { NextRequest, NextResponse } from 'next/server';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';
import { generateBriefingSchema } from '@/lib/api/schemas';
import { generateAndSaveBriefing } from '@/lib/services/briefing-service';

export async function POST(request: NextRequest) {
  try {
    const { mentorId, error } = await requireMentor();
    if (error) return error;

    const body = await request.json();
    const parsed = generateBriefingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const briefing = await generateAndSaveBriefing(mentorId!, parsed.data.mentee_id);
    return NextResponse.json(briefing);
  } catch (error) {
    return sanitizedError(error);
  }
}
