import { getDashboardOverview, getMenteesList, getMenteeProfile, getMenteeEntries, getGroupInsights } from '@/lib/services/dashboard-service';

// Mock the Supabase server client
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockNeq = jest.fn();
const mockGte = jest.fn();
const mockLt = jest.fn();
const mockOrder = jest.fn();
const mockLimit = jest.fn();
const mockRange = jest.fn();
const mockSingle = jest.fn();
const mockInsert = jest.fn();
const mockRpc = jest.fn();

// Build chainable query mock
function buildChain(resolvedValue: any = { data: null, count: 0, error: null }) {
  const chain: any = {};
  const methods = ['select', 'eq', 'neq', 'gte', 'lt', 'lte', 'order', 'limit', 'range', 'single', 'insert'];
  for (const m of methods) {
    chain[m] = jest.fn().mockReturnValue(chain);
  }
  // The terminal call resolves
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.neq.mockReturnValue(chain);
  chain.gte.mockReturnValue(chain);
  chain.lt.mockReturnValue(chain);
  chain.lte.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);
  chain.range.mockReturnValue(chain);
  chain.single.mockReturnValue(resolvedValue);

  // Make the chain itself act as a resolved promise for non-single queries
  chain.then = (resolve: any) => resolve(resolvedValue);

  return chain;
}

const mockFrom = jest.fn();
const mockSupabase = {
  from: mockFrom,
  rpc: mockRpc,
};

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: () => mockSupabase,
}));

describe('dashboard-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardOverview', () => {
    it('should return dashboard data with correct structure', async () => {
      // Set up chain mocks for each .from() call
      const menteeCountChain = buildChain({ data: null, count: 3, error: null });
      const entriesWeekChain = buildChain({ data: null, count: 12, error: null });
      const activeUsersChain = buildChain({
        data: [{ user_id: 'u1' }, { user_id: 'u2' }],
        error: null,
      });
      const menteesListChain = buildChain({
        data: [
          { id: 'u1', name: 'Maria' },
          { id: 'u2', name: 'Joao' },
        ],
        error: null,
      });
      // For each mentee's last entry lookup
      const lastEntryChain1 = buildChain({
        data: [{ date: new Date().toISOString().split('T')[0] }],
        error: null,
      });
      const lastEntryChain2 = buildChain({
        data: [{ date: '2026-02-20' }],
        error: null,
      });
      const recentActivityChain = buildChain({
        data: [
          {
            id: 'e1',
            date: '2026-02-28',
            category: 'audiencia',
            emotion: 'ansiedade',
            intensity: 7,
            user_id: 'u1',
            users: { name: 'Maria' },
          },
        ],
        error: null,
      });

      let fromCallIndex = 0;
      mockFrom.mockImplementation((table: string) => {
        fromCallIndex++;
        if (table === 'users' && fromCallIndex <= 1) return menteeCountChain;
        if (table === 'daily_entries' && fromCallIndex === 2) return entriesWeekChain;
        if (table === 'daily_entries' && fromCallIndex === 3) return activeUsersChain;
        if (table === 'users' && fromCallIndex === 4) return menteesListChain;
        if (table === 'daily_entries' && fromCallIndex === 5) return lastEntryChain1;
        if (table === 'daily_entries' && fromCallIndex === 6) return lastEntryChain2;
        if (table === 'daily_entries' && fromCallIndex === 7) return recentActivityChain;
        return buildChain();
      });

      const result = await getDashboardOverview('mentor-1');

      expect(result).toHaveProperty('total_mentees');
      expect(result).toHaveProperty('entries_this_week');
      expect(result).toHaveProperty('engagement_pct');
      expect(result).toHaveProperty('alerts_count');
      expect(result).toHaveProperty('alerts');
      expect(result).toHaveProperty('recent_activity');
      expect(typeof result.total_mentees).toBe('number');
      expect(typeof result.engagement_pct).toBe('number');
    });
  });

  describe('getMenteeEntries', () => {
    it('should return paginated entries for a mentee', async () => {
      const chain = buildChain({
        data: [
          {
            id: 'e1',
            date: '2026-02-28',
            situation: 'Test',
            category: 'outro',
            emotion: 'medo',
            intensity: 5,
            reaction: 'Test',
            self_perception: 'unsure',
            user_id: 'mentee-1',
            created_at: '2026-02-28T10:00:00Z',
            ai_reflections: [{ id: 'ref-1', questions: ['Q1'], answers: null }],
          },
        ],
        count: 1,
        error: null,
      });

      mockFrom.mockReturnValue(chain);

      const result = await getMenteeEntries('mentee-1', 1, 20);

      expect(result.entries).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.entries[0].ai_reflections).toEqual({ id: 'ref-1', questions: ['Q1'], answers: null });
    });

    it('should throw when supabase returns an error', async () => {
      const chain = buildChain({
        data: null,
        count: null,
        error: { message: 'Connection failed' },
      });
      mockFrom.mockReturnValue(chain);

      await expect(getMenteeEntries('mentee-1')).rejects.toThrow('Failed to fetch entries');
    });
  });

  describe('getGroupInsights', () => {
    it('should return empty defaults when no entries exist', async () => {
      const emptyChain = buildChain({ data: [], error: null });
      mockFrom.mockReturnValue(emptyChain);

      const result = await getGroupInsights('mentor-1', 'week');

      expect(result).toEqual({
        top_emotions: [],
        top_category: null,
        avg_intensity_current: 0,
        avg_intensity_previous: 0,
        reactive_vs_strategic: { reactive: 0, strategic: 0, unsure: 0 },
        total_entries: 0,
      });
    });

    it('should compute emotion counts and intensity averages with data', async () => {
      const entriesData = [
        { emotion: 'ansiedade', category: 'audiencia', intensity: 6, self_perception: 'strategic' },
        { emotion: 'ansiedade', category: 'audiencia', intensity: 8, self_perception: 'reactive' },
        { emotion: 'raiva', category: 'cliente', intensity: 7, self_perception: 'reactive' },
      ];
      const currentChain = buildChain({ data: entriesData, error: null });
      const prevChain = buildChain({ data: [{ intensity: 5 }], error: null });

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        return callCount === 1 ? currentChain : prevChain;
      });

      const result = await getGroupInsights('mentor-1', 'week');

      expect(result.total_entries).toBe(3);
      expect(result.top_emotions).toHaveLength(2);
      expect(result.top_emotions[0].emotion).toBe('ansiedade');
      expect(result.top_emotions[0].count).toBe(2);
      expect(result.avg_intensity_current).toBe(7);
      expect(result.reactive_vs_strategic.reactive).toBe(67);
      expect(result.reactive_vs_strategic.strategic).toBe(33);
    });
  });

  describe('getMenteeProfile', () => {
    it('should return null when mentee is not found', async () => {
      const chain = buildChain({ data: null, error: { message: 'Not found' } });
      mockFrom.mockReturnValue(chain);

      const result = await getMenteeProfile('mentor-1', 'nonexistent');
      expect(result).toBeNull();
    });
  });
});
