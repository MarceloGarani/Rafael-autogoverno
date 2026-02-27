import { submitEntry, fetchEntries, fetchEntryById, fetchLast7Days, fetchEntryCount, fetchEntriesByDateRange } from '@/lib/services/entry-service';
import { createEntry, getEntries, getEntryById, getLast7DaysEntries, getEntryCount, getEntriesByDateRange } from '@/lib/db/entries';
import { getUserStreak, checkAndAwardBadges } from '@/lib/db/badges';
import type { DailyEntry, DailyEntryWithReflection } from '@/types/database';

jest.mock('@/lib/db/entries');
jest.mock('@/lib/db/badges');

const mockedCreateEntry = createEntry as jest.MockedFunction<typeof createEntry>;
const mockedGetEntries = getEntries as jest.MockedFunction<typeof getEntries>;
const mockedGetEntryById = getEntryById as jest.MockedFunction<typeof getEntryById>;
const mockedGetLast7DaysEntries = getLast7DaysEntries as jest.MockedFunction<typeof getLast7DaysEntries>;
const mockedGetEntryCount = getEntryCount as jest.MockedFunction<typeof getEntryCount>;
const mockedGetEntriesByDateRange = getEntriesByDateRange as jest.MockedFunction<typeof getEntriesByDateRange>;
const mockedGetUserStreak = getUserStreak as jest.MockedFunction<typeof getUserStreak>;
const mockedCheckAndAwardBadges = checkAndAwardBadges as jest.MockedFunction<typeof checkAndAwardBadges>;

const mockEntry: DailyEntry = {
  id: 'entry-1',
  user_id: 'user-1',
  date: '2026-02-28',
  situation: 'Audiencia complicada',
  category: 'audiencia',
  emotion: 'ansiedade',
  intensity: 7,
  reaction: 'Mantive a calma',
  self_perception: 'strategic',
  created_at: '2026-02-28T10:00:00Z',
};

describe('entry-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitEntry', () => {
    it('should create an entry, check streak and badges, and return results', async () => {
      mockedCreateEntry.mockResolvedValue(mockEntry);
      mockedGetUserStreak.mockResolvedValue({ current_streak: 7, max_streak: 10 });
      mockedCheckAndAwardBadges.mockResolvedValue(['7_days']);

      const result = await submitEntry('user-1', {
        situation: 'Audiencia complicada',
        category: 'audiencia',
        emotion: 'ansiedade',
        intensity: 7,
        reaction: 'Mantive a calma',
        self_perception: 'strategic',
      });

      expect(mockedCreateEntry).toHaveBeenCalledWith('user-1', expect.objectContaining({
        situation: 'Audiencia complicada',
        category: 'audiencia',
      }));
      expect(mockedGetUserStreak).toHaveBeenCalledWith('user-1');
      expect(mockedCheckAndAwardBadges).toHaveBeenCalledWith('user-1', 7);
      expect(result.entry).toEqual(mockEntry);
      expect(result.newBadges).toEqual(['7_days']);
    });

    it('should propagate error when createEntry fails', async () => {
      mockedCreateEntry.mockRejectedValue(new Error('DB error'));

      await expect(
        submitEntry('user-1', {
          situation: 'Test',
          category: 'outro',
          emotion: 'medo',
          intensity: 5,
          reaction: 'Reagi mal',
          self_perception: 'reactive',
        })
      ).rejects.toThrow('DB error');
    });

    it('should return empty badges when streak is low', async () => {
      mockedCreateEntry.mockResolvedValue(mockEntry);
      mockedGetUserStreak.mockResolvedValue({ current_streak: 2, max_streak: 2 });
      mockedCheckAndAwardBadges.mockResolvedValue([]);

      const result = await submitEntry('user-1', {
        situation: 'Test',
        category: 'outro',
        emotion: 'raiva',
        intensity: 3,
        reaction: 'Nada',
        self_perception: 'unsure',
      });

      expect(result.newBadges).toEqual([]);
    });
  });

  describe('fetchEntries', () => {
    it('should delegate to getEntries with filters', async () => {
      const mockResult = { entries: [] as DailyEntryWithReflection[], total: 0 };
      mockedGetEntries.mockResolvedValue(mockResult);

      const result = await fetchEntries('user-1', { period: 'week', page: 1 });

      expect(mockedGetEntries).toHaveBeenCalledWith('user-1', { period: 'week', page: 1 });
      expect(result).toEqual(mockResult);
    });
  });

  describe('fetchEntryById', () => {
    it('should return entry when found', async () => {
      mockedGetEntryById.mockResolvedValue(mockEntry);
      const result = await fetchEntryById('entry-1');
      expect(result).toEqual(mockEntry);
    });

    it('should return null when entry not found', async () => {
      mockedGetEntryById.mockResolvedValue(null);
      const result = await fetchEntryById('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('fetchLast7Days', () => {
    it('should delegate to getLast7DaysEntries', async () => {
      mockedGetLast7DaysEntries.mockResolvedValue([mockEntry]);
      const result = await fetchLast7Days('user-1');
      expect(result).toEqual([mockEntry]);
      expect(mockedGetLast7DaysEntries).toHaveBeenCalledWith('user-1');
    });
  });
});
