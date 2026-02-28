/**
 * Unit tests for GET /api/progress and GET /api/progress/streak route handlers.
 */

// --- Mocks (jest.mock is hoisted, so use inline factories) -----------

const mockOrder = jest.fn();
const mockGte = jest.fn(() => ({ order: mockOrder }));
const mockEq = jest.fn(() => ({ gte: mockGte }));
const mockSelect = jest.fn(() => ({ eq: mockEq }));
const mockFrom = jest.fn(() => ({ select: mockSelect }));

jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation(function (this: any, input: string | URL, init?: any) {
    const url = typeof input === 'string' ? new URL(input, 'http://localhost:3000') : input;
    this.url = url.toString();
    this.method = init?.method ?? 'GET';
    this.json = async () => JSON.parse(init?.body ?? '{}');
  }),
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status ?? 200,
    })),
  },
}));

const mockGetUser = jest.fn();

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const mockGetUserStreak = jest.fn();
const mockGetUserBadges = jest.fn();

jest.mock('@/lib/db/badges', () => ({
  getUserStreak: (...args: unknown[]) => mockGetUserStreak(...args),
  getUserBadges: (...args: unknown[]) => mockGetUserBadges(...args),
}));

const mockGetEntryCount = jest.fn();

jest.mock('@/lib/db/entries', () => ({
  getEntryCount: (...args: unknown[]) => mockGetEntryCount(...args),
}));

// --- Import handlers after all mocks ---------------------------------

import { GET as progressGET } from '@/app/api/progress/route';
import { GET as streakGET } from '@/app/api/progress/streak/route';
import { NextRequest } from 'next/server';

// --- Helpers ---------------------------------------------------------

function buildRequest(url: string) {
  return new NextRequest(url, { method: 'GET' });
}

// --- Tests: GET /api/progress ----------------------------------------

describe('GET /api/progress', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await progressGET(buildRequest('http://localhost:3000/api/progress'));

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns progress data on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockOrder.mockResolvedValue({
      data: [
        {
          date: '2026-02-25',
          intensity: 7,
          category: 'audiencia',
          emotion: 'ansiedade',
          self_perception: 'strategic',
        },
        {
          date: '2026-02-26',
          intensity: 5,
          category: 'negociacao',
          emotion: 'medo',
          self_perception: 'reactive',
        },
      ],
    });
    mockGetUserStreak.mockResolvedValue({ current_streak: 3, max_streak: 7 });
    mockGetUserBadges.mockResolvedValue([{ id: 'b1', type: '7_days' }]);
    mockGetEntryCount.mockResolvedValue(15);

    const res = await progressGET(buildRequest('http://localhost:3000/api/progress?period=month'));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.streak).toBe(3);
    expect(json.max_streak).toBe(7);
    expect(json.total_entries).toBe(15);
    expect(json.badges).toEqual([{ id: 'b1', type: '7_days' }]);
    expect(json.intensity_by_week).toBeDefined();
    expect(json.category_distribution).toBeDefined();
    expect(json.reactive_vs_strategic).toBeDefined();
    expect(mockGetUserStreak).toHaveBeenCalledWith('u1');
    expect(mockGetUserBadges).toHaveBeenCalledWith('u1');
    expect(mockGetEntryCount).toHaveBeenCalledWith('u1');
  });

  it('returns 500 on error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockOrder.mockRejectedValue(new Error('Query timeout'));

    const res = await progressGET(buildRequest('http://localhost:3000/api/progress'));

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Query timeout');
  });
});

// --- Tests: GET /api/progress/streak ---------------------------------

describe('GET /api/progress/streak', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await streakGET();

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns streak on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    const mockStreak = { current_streak: 5, max_streak: 12 };
    mockGetUserStreak.mockResolvedValue(mockStreak);

    const res = await streakGET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockStreak);
    expect(mockGetUserStreak).toHaveBeenCalledWith('u1');
  });

  it('returns 500 on error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockGetUserStreak.mockRejectedValue(new Error('Connection lost'));

    const res = await streakGET();

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Connection lost');
  });
});
