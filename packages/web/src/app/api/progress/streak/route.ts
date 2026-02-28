import { NextResponse } from 'next/server';
import { requireAuth, sanitizedError } from '@/lib/api/helpers';
import { getUserStreak } from '@/lib/db/badges';

export async function GET() {
  try {
    const { user, error } = await requireAuth();
    if (error) return error;

    const streak = await getUserStreak(user!.id);
    return NextResponse.json(streak);
  } catch (error) {
    return sanitizedError(error);
  }
}
