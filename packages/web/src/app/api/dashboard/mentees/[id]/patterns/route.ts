import { NextRequest, NextResponse } from 'next/server';
import { requireMentor, sanitizedError } from '@/lib/api/helpers';
import { generatePatterns } from '@/lib/ai/generate';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { supabase, error } = await requireMentor();
    if (error) return error;

    const { data: entries } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', params.id)
      .order('date', { ascending: true });

    if (!entries || entries.length === 0) {
      return NextResponse.json({ patterns: [] });
    }

    const result = await generatePatterns(entries);
    return NextResponse.json(result);
  } catch (error) {
    return sanitizedError(error);
  }
}
