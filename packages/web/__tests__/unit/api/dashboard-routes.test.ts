/**
 * Unit tests for mentor dashboard route handlers:
 * - GET /api/dashboard/mentees
 * - GET /api/dashboard/mentees/[id]
 * - GET /api/dashboard/mentees/[id]/entries
 * - GET /api/dashboard/insights
 *
 * NOTE: /api/dashboard/overview is covered in dashboard.test.ts.
 * NOTE: /api/dashboard/mentees/[id]/patterns is skipped (AI-dependent).
 */

// --- Mocks (jest.mock is hoisted, so use inline factories) -----------

const mockGetUser = jest.fn();
const mockProfileSingle = jest.fn();
const mockProfileEq = jest.fn(() => ({ single: mockProfileSingle }));
const mockProfileSelect = jest.fn(() => ({ eq: mockProfileEq }));
const mockFrom = jest.fn(() => ({ select: mockProfileSelect }));

jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation(function (this: any, input: string | URL, init?: any) {
    const url = typeof input === 'string' ? new URL(input, 'http://localhost:3000') : input;
    this.url = url.toString();
    this.method = init?.method ?? 'GET';
    this.json = async () => JSON.parse(init?.body ?? '{}');
    this.headers = new Map(Object.entries(init?.headers || {}));
    if (!this.headers.get) {
      const headers = init?.headers || {};
      this.headers = { get: (key: string) => headers[key] || null };
    }
  }),
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status ?? 200,
    })),
  },
}));

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const mockGetMenteesList = jest.fn();
const mockGetMenteeProfile = jest.fn();
const mockGetMenteeEntries = jest.fn();
const mockGetGroupInsights = jest.fn();

jest.mock('@/lib/services/dashboard-service', () => ({
  getMenteesList: (...args: unknown[]) => mockGetMenteesList(...args),
  getMenteeProfile: (...args: unknown[]) => mockGetMenteeProfile(...args),
  getMenteeEntries: (...args: unknown[]) => mockGetMenteeEntries(...args),
  getGroupInsights: (...args: unknown[]) => mockGetGroupInsights(...args),
}));

// --- Import handlers after all mocks ---------------------------------

import { GET as GET_MENTEES } from '@/app/api/dashboard/mentees/route';
import { GET as GET_MENTEE_PROFILE } from '@/app/api/dashboard/mentees/[id]/route';
import { GET as GET_MENTEE_ENTRIES } from '@/app/api/dashboard/mentees/[id]/entries/route';
import { GET as GET_INSIGHTS } from '@/app/api/dashboard/insights/route';
import { NextRequest } from 'next/server';

// --- Helpers ---------------------------------------------------------

function mockMentorAuth() {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'mentor-1' } } });
  mockProfileSingle.mockResolvedValue({ data: { role: 'mentor' } });
}

function mockMenteeAuth() {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'mentee-1' } } });
  mockProfileSingle.mockResolvedValue({ data: { role: 'mentee' } });
}

function mockNoAuth() {
  mockGetUser.mockResolvedValue({ data: { user: null } });
}

function buildRequest(method: string, url: string, body?: Record<string, unknown>) {
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
}

const MENTEE_ID = 'mentee-abc';

// --- Tests: GET /api/dashboard/mentees -------------------------------

describe('GET /api/dashboard/mentees', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await GET_MENTEES();

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 403 when not mentor', async () => {
    mockMenteeAuth();

    const res = await GET_MENTEES();

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns mentees list on success', async () => {
    mockMentorAuth();
    const mockMentees = [
      { id: 'm1', name: 'Ana Silva', status: 'active', streak: 5, avg_intensity: 6.2 },
      { id: 'm2', name: 'Carlos Souza', status: 'inactive', streak: 0, avg_intensity: 8.1 },
    ];
    mockGetMenteesList.mockResolvedValue(mockMentees);

    const res = await GET_MENTEES();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockMentees);
    expect(mockGetMenteesList).toHaveBeenCalledWith('mentor-1');
  });
});

// --- Tests: GET /api/dashboard/mentees/[id] --------------------------

describe('GET /api/dashboard/mentees/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await GET_MENTEE_PROFILE(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/mentees/' + MENTEE_ID),
      { params: { id: MENTEE_ID } }
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 404 when mentee not found', async () => {
    mockMentorAuth();
    mockGetMenteeProfile.mockResolvedValue(null);

    const res = await GET_MENTEE_PROFILE(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/mentees/' + MENTEE_ID),
      { params: { id: MENTEE_ID } }
    );

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('Not found');
  });

  it('returns profile on success', async () => {
    mockMentorAuth();
    const mockProfile = {
      id: MENTEE_ID,
      name: 'Ana Silva',
      email: 'ana@example.com',
      streak: 12,
      total_entries: 45,
      avg_intensity: 5.8,
    };
    mockGetMenteeProfile.mockResolvedValue(mockProfile);

    const res = await GET_MENTEE_PROFILE(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/mentees/' + MENTEE_ID),
      { params: { id: MENTEE_ID } }
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockProfile);
    expect(mockGetMenteeProfile).toHaveBeenCalledWith('mentor-1', MENTEE_ID);
  });
});

// --- Tests: GET /api/dashboard/mentees/[id]/entries ------------------

describe('GET /api/dashboard/mentees/[id]/entries', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await GET_MENTEE_ENTRIES(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/mentees/' + MENTEE_ID + '/entries'),
      { params: { id: MENTEE_ID } }
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns entries with default pagination', async () => {
    mockMentorAuth();
    const mockResult = {
      entries: [{ id: 'e1', date: '2026-02-28' }, { id: 'e2', date: '2026-02-27' }],
      total: 2,
    };
    mockGetMenteeEntries.mockResolvedValue(mockResult);

    const res = await GET_MENTEE_ENTRIES(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/mentees/' + MENTEE_ID + '/entries'),
      { params: { id: MENTEE_ID } }
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockResult);
    expect(mockGetMenteeEntries).toHaveBeenCalledWith(MENTEE_ID, 1, 20);
  });

  it('returns entries with custom page/limit', async () => {
    mockMentorAuth();
    const mockResult = {
      entries: [{ id: 'e3', date: '2026-02-20' }],
      total: 25,
    };
    mockGetMenteeEntries.mockResolvedValue(mockResult);

    const res = await GET_MENTEE_ENTRIES(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/mentees/' + MENTEE_ID + '/entries?page=3&limit=5'),
      { params: { id: MENTEE_ID } }
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockResult);
    expect(mockGetMenteeEntries).toHaveBeenCalledWith(MENTEE_ID, 3, 5);
  });
});

// --- Tests: GET /api/dashboard/insights ------------------------------

describe('GET /api/dashboard/insights', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await GET_INSIGHTS(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/insights')
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns insights with period param', async () => {
    mockMentorAuth();
    const mockInsights = {
      top_emotions: [{ emotion: 'ansiedade', count: 15 }],
      challenging_categories: [{ category: 'audiencia', count: 12 }],
      overall_evolution: { avg_intensity_trend: 'decreasing' },
    };
    mockGetGroupInsights.mockResolvedValue(mockInsights);

    const res = await GET_INSIGHTS(
      buildRequest('GET', 'http://localhost:3000/api/dashboard/insights?period=month')
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockInsights);
    expect(mockGetGroupInsights).toHaveBeenCalledWith('mentor-1', 'month');
  });
});
