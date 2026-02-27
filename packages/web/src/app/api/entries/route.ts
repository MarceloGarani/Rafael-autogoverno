import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { submitEntry, fetchEntries } from '@/lib/services/entry-service';
import type { EntryCategory, EntryEmotion, SelfPerceptionType } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { situation, category, emotion, intensity, reaction, self_perception } = body;

    if (!situation || situation.length < 10) {
      return NextResponse.json({ error: 'Situação deve ter pelo menos 10 caracteres' }, { status: 400 });
    }
    if (!category || !emotion || !intensity || !reaction || reaction.length < 10 || !self_perception) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 });
    }
    if (intensity < 1 || intensity > 10) {
      return NextResponse.json({ error: 'Intensidade deve ser entre 1 e 10' }, { status: 400 });
    }

    const { entry, newBadges } = await submitEntry(user.id, {
      situation,
      category: category as EntryCategory,
      emotion: emotion as EntryEmotion,
      intensity,
      reaction,
      self_perception: self_perception as SelfPerceptionType,
    });

    return NextResponse.json({ id: entry.id, status: 'created', newBadges });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const result = await fetchEntries(user.id, {
      period: (searchParams.get('period') as 'week' | 'month' | 'custom') || undefined,
      start_date: searchParams.get('start_date') || undefined,
      end_date: searchParams.get('end_date') || undefined,
      category: (searchParams.get('category') as EntryCategory) || undefined,
      emotion: (searchParams.get('emotion') as EntryEmotion) || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
