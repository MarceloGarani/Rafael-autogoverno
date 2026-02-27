import { createEntry, getEntries, getEntryById, getLast7DaysEntries, getEntryCount, getEntriesByDateRange } from '@/lib/db/entries';
import { getUserStreak, checkAndAwardBadges } from '@/lib/db/badges';
import type { EntryCategory, EntryEmotion, SelfPerceptionType, DailyEntry, DailyEntryWithReflection } from '@/types/database';

export async function submitEntry(
  userId: string,
  data: {
    situation: string;
    category: EntryCategory;
    emotion: EntryEmotion;
    intensity: number;
    reaction: string;
    self_perception: SelfPerceptionType;
  }
): Promise<{ entry: DailyEntry; newBadges: string[] }> {
  const today = new Date().toISOString().split('T')[0];

  const entry = await createEntry(userId, {
    date: today,
    ...data,
  });

  // Check badges
  const { current_streak } = await getUserStreak(userId);
  const newBadges = await checkAndAwardBadges(userId, current_streak);

  return { entry, newBadges };
}

export async function fetchEntries(
  userId: string,
  filters?: {
    period?: 'week' | 'month' | 'custom';
    start_date?: string;
    end_date?: string;
    category?: EntryCategory;
    emotion?: EntryEmotion;
    page?: number;
    limit?: number;
  }
): Promise<{ entries: DailyEntryWithReflection[]; total: number }> {
  return getEntries(userId, filters);
}

export async function fetchEntryById(entryId: string): Promise<DailyEntry | null> {
  return getEntryById(entryId);
}

export async function fetchLast7Days(userId: string) {
  return getLast7DaysEntries(userId);
}

export async function fetchEntryCount(userId: string) {
  return getEntryCount(userId);
}

export async function fetchEntriesByDateRange(userId: string, startDate: string, endDate: string) {
  return getEntriesByDateRange(userId, startDate, endDate);
}
