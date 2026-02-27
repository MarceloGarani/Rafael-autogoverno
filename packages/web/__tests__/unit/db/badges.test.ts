/* ---------- Supabase chain mock ---------- */
const mockSingle = jest.fn();
const mockUpsertSelect = jest.fn(() => ({ single: mockSingle }));
const mockUpsert = jest.fn(() => ({ select: mockUpsertSelect }));

const mockBadgeOrder = jest.fn();
const mockBadgeEq = jest.fn(() => ({ order: mockBadgeOrder }));
const mockBadgeSelect = jest.fn(() => ({ eq: mockBadgeEq }));

// Perfect week count query chain
const mockCountLte = jest.fn();
const mockCountGte = jest.fn(() => ({ lte: mockCountLte }));
const mockCountEq = jest.fn(() => ({ gte: mockCountGte }));
const mockCountSelect = jest.fn(() => ({ eq: mockCountEq }));

const mockRpc = jest.fn();

const mockFrom = jest.fn((table: string) => {
  if (table === 'badges') {
    return {
      select: mockBadgeSelect,
      upsert: mockUpsert,
    };
  }
  // daily_entries (for perfect week check)
  return {
    select: mockCountSelect,
  };
});

const mockSupabase = { from: mockFrom, rpc: mockRpc };

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => mockSupabase,
}));

import { getUserStreak, checkAndAwardBadges } from '@/lib/db/badges';

beforeEach(() => jest.clearAllMocks());

/* ---------- tests ---------- */
describe('getUserStreak', () => {
  it('returns streak data from the RPC call', async () => {
    mockRpc.mockResolvedValueOnce({
      data: [{ current_streak: 12, max_streak: 30 }],
      error: null,
    });

    const result = await getUserStreak('user-1');

    expect(mockRpc).toHaveBeenCalledWith('get_user_streak', {
      p_user_id: 'user-1',
    });
    expect(result).toEqual({ current_streak: 12, max_streak: 30 });
  });

  it('returns zeros when RPC returns an error', async () => {
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'rpc error' },
    });

    const result = await getUserStreak('user-1');
    expect(result).toEqual({ current_streak: 0, max_streak: 0 });
  });

  it('returns zeros when RPC returns empty array', async () => {
    mockRpc.mockResolvedValueOnce({ data: [], error: null });

    const result = await getUserStreak('user-1');
    expect(result).toEqual({ current_streak: 0, max_streak: 0 });
  });
});

describe('checkAndAwardBadges', () => {
  it('awards 7_days badge when streak is exactly 7', async () => {
    // awardBadge returns a badge object for 7_days
    mockSingle.mockResolvedValueOnce({
      data: { id: 'b1', user_id: 'user-1', badge_type: '7_days', earned_at: '2026-02-28' },
      error: null,
    });
    // Perfect week count check
    mockCountLte.mockResolvedValueOnce({ count: 3, error: null });

    const awarded = await checkAndAwardBadges('user-1', 7);

    expect(awarded).toContain('7_days');
    expect(awarded).not.toContain('30_days');
    expect(awarded).not.toContain('90_days');
  });

  it('awards 7_days, 30_days, and 90_days badges when streak >= 90', async () => {
    // Three successive awardBadge calls
    mockSingle
      .mockResolvedValueOnce({
        data: { id: 'b1', badge_type: '7_days' },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { id: 'b2', badge_type: '30_days' },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { id: 'b3', badge_type: '90_days' },
        error: null,
      });
    // Perfect week count (not 7)
    mockCountLte.mockResolvedValueOnce({ count: 5, error: null });

    const awarded = await checkAndAwardBadges('user-1', 90);

    expect(awarded).toContain('7_days');
    expect(awarded).toContain('30_days');
    expect(awarded).toContain('90_days');
    expect(awarded).not.toContain('perfect_week');
  });

  it('awards perfect_week badge when 7 entries exist in the current week', async () => {
    // No streak badges (streak 2 < 7)
    // Perfect week count = 7
    mockCountLte.mockResolvedValueOnce({ count: 7, error: null });
    // awardBadge for perfect_week
    mockSingle.mockResolvedValueOnce({
      data: { id: 'b4', badge_type: 'perfect_week' },
      error: null,
    });

    const awarded = await checkAndAwardBadges('user-1', 2);

    expect(awarded).toEqual(['perfect_week']);
  });

  it('returns empty array when no badge thresholds are met', async () => {
    // streak = 3 (below 7), perfect week count = 2
    mockCountLte.mockResolvedValueOnce({ count: 2, error: null });

    const awarded = await checkAndAwardBadges('user-1', 3);

    expect(awarded).toEqual([]);
  });
});
