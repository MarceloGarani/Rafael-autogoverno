/**
 * Unit tests for GET /api/dashboard/overview route handler.
 */

// --- Mocks (jest.mock is hoisted, so use inline factories) -----------

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status ?? 200,
    })),
  },
}));

const mockGetUser = jest.fn();
const mockSingle = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: mockSingle,
        })),
      })),
    })),
  })),
}));

const mockGetDashboardOverview = jest.fn();

jest.mock('@/lib/services/dashboard-service', () => ({
  getDashboardOverview: (...args: unknown[]) => mockGetDashboardOverview(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { GET } from '@/app/api/dashboard/overview/route';

// --- Tests -----------------------------------------------------------

describe('GET /api/dashboard/overview', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET();

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 403 when user is not a mentor', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSingle.mockResolvedValue({ data: { role: 'mentee' } });

    const res = await GET();

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns dashboard overview on success for mentor', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'mentor-1' } } });
    mockSingle.mockResolvedValue({ data: { role: 'mentor' } });
    const mockOverview = {
      total_mentees: 5,
      entries_this_week: 18,
      engagement_pct: 80,
      alerts_count: 1,
      alerts: [{ id: 'u3', menteeName: 'João', daysInactive: 5 }],
      recent_activity: [],
    };
    mockGetDashboardOverview.mockResolvedValue(mockOverview);

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockOverview);
    expect(mockGetDashboardOverview).toHaveBeenCalledWith('mentor-1');
  });

  it('returns 500 when service throws', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'mentor-1' } } });
    mockSingle.mockResolvedValue({ data: { role: 'mentor' } });
    mockGetDashboardOverview.mockRejectedValue(new Error('Supabase timeout'));

    const res = await GET();

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Supabase timeout');
  });
});
