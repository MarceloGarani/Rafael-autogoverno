import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, sanitizedError, clampLimit } from '@/lib/api/helpers';
import { createEntrySchema } from '@/lib/api/schemas';
import { submitEntry, fetchEntries } from '@/lib/services/entry-service';
import type { EntryCategory, EntryEmotion } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const parsed = createEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { situation, category, emotion, intensity, reaction, self_perception } = parsed.data;

    const { entry, newBadges } = await submitEntry(user!.id, {
      situation,
      category,
      emotion,
      intensity,
      reaction,
      self_perception,
    });

    return NextResponse.json({ id: entry.id, status: 'created', newBadges });
  } catch (error) {
    return sanitizedError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const result = await fetchEntries(user!.id, {
      period: (searchParams.get('period') as 'week' | 'month' | 'custom') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      category: (searchParams.get('category') as EntryCategory) || undefined,
      emotion: (searchParams.get('emotion') as EntryEmotion) || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: clampLimit(searchParams.get('limit')),
    });

    return NextResponse.json(result);
  } catch (error) {
    return sanitizedError(error);
  }
}
