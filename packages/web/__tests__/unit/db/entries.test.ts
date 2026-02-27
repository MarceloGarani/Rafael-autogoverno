/* ---------- Supabase mock ---------- */
const mockSingle = jest.fn();
const mockSelect = jest.fn(() => ({ single: mockSingle }));
const mockInsert = jest.fn(() => ({ select: mockSelect }));
const mockRange = jest.fn();
const mockOrder = jest.fn(() => ({ range: mockRange }));
const mockLte = jest.fn(() => ({ order: mockOrder }));
const mockGte = jest.fn(() => ({ order: mockOrder, lte: mockLte }));
const mockEq = jest.fn((_col: string, _val: unknown) => ({
  order: mockOrder,
  eq: mockEq,
  gte: mockGte,
  lte: mockLte,
}));
const mockFrom = jest.fn(() => ({
  insert: mockInsert,
  select: jest.fn(() => ({
    eq: mockEq,
    count: 'exact',
  })),
}));

const mockSupabase = { from: mockFrom };

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => mockSupabase,
}));

import {
  createEntry,
  getEntriesByDateRange,
} from '@/lib/db/entries';

/* ---------- helpers ---------- */
const entryInput = {
  date: '2026-02-28',
  situation: 'Audiência difícil',
  category: 'audiencia' as const,
  emotion: 'ansiedade' as const,
  intensity: 7,
  reaction: 'Mantive a calma',
  self_perception: 'strategic',
};

const fakeEntry = {
  id: 'entry-1',
  user_id: 'user-1',
  ...entryInput,
  created_at: '2026-02-28T10:00:00Z',
};

beforeEach(() => jest.clearAllMocks());

/* ---------- tests ---------- */
describe('createEntry', () => {
  it('inserts into daily_entries and returns the created row', async () => {
    mockSingle.mockResolvedValueOnce({ data: fakeEntry, error: null });

    const result = await createEntry('user-1', entryInput);

    expect(mockFrom).toHaveBeenCalledWith('daily_entries');
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      ...entryInput,
    });
    expect(result).toEqual(fakeEntry);
  });

  it('throws when Supabase returns an error', async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'insert failed' },
    });

    await expect(createEntry('user-1', entryInput)).rejects.toThrow(
      'Failed to create entry: insert failed'
    );
  });
});

describe('getEntriesByDateRange', () => {
  it('queries with correct user_id, date range and ascending order', async () => {
    // Build a full chain mock for getEntriesByDateRange
    const chainOrder = jest.fn().mockResolvedValueOnce({ data: [fakeEntry], error: null });
    const chainLte = jest.fn(() => ({ order: chainOrder }));
    const chainGte = jest.fn(() => ({ lte: chainLte }));
    const chainEq = jest.fn(() => ({ gte: chainGte }));
    const chainSelect = jest.fn(() => ({ eq: chainEq }));

    mockFrom.mockReturnValueOnce({
      select: chainSelect,
    } as any);

    const result = await getEntriesByDateRange('user-1', '2026-02-01', '2026-02-28');

    expect(mockFrom).toHaveBeenCalledWith('daily_entries');
    expect(chainSelect).toHaveBeenCalledWith('*');
    expect(chainEq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(chainGte).toHaveBeenCalledWith('date', '2026-02-01');
    expect(chainLte).toHaveBeenCalledWith('date', '2026-02-28');
    expect(chainOrder).toHaveBeenCalledWith('date', { ascending: true });
    expect(result).toEqual([fakeEntry]);
  });

  it('returns empty array when data is null', async () => {
    const chainOrder = jest.fn().mockResolvedValueOnce({ data: null, error: null });
    const chainLte = jest.fn(() => ({ order: chainOrder }));
    const chainGte = jest.fn(() => ({ lte: chainLte }));
    const chainEq = jest.fn(() => ({ gte: chainGte }));
    const chainSelect = jest.fn(() => ({ eq: chainEq }));

    mockFrom.mockReturnValueOnce({ select: chainSelect } as any);

    const result = await getEntriesByDateRange('user-1', '2026-02-01', '2026-02-28');
    expect(result).toEqual([]);
  });

  it('throws when Supabase returns an error', async () => {
    const chainOrder = jest.fn().mockResolvedValueOnce({
      data: null,
      error: { message: 'fetch failed' },
    });
    const chainLte = jest.fn(() => ({ order: chainOrder }));
    const chainGte = jest.fn(() => ({ lte: chainLte }));
    const chainEq = jest.fn(() => ({ gte: chainGte }));
    const chainSelect = jest.fn(() => ({ eq: chainEq }));

    mockFrom.mockReturnValueOnce({ select: chainSelect } as any);

    await expect(
      getEntriesByDateRange('user-1', '2026-02-01', '2026-02-28')
    ).rejects.toThrow('Failed to fetch entries: fetch failed');
  });
});
