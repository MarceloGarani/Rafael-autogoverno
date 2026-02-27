/**
 * Unit tests for GET /api/reports route handler.
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

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

const mockFetchUserReports = jest.fn();

jest.mock('@/lib/services/report-service', () => ({
  fetchUserReports: (...args: unknown[]) => mockFetchUserReports(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { GET } from '@/app/api/reports/route';

// --- Tests -----------------------------------------------------------

describe('GET /api/reports', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET();

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns reports array on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    const mockReports = [
      {
        id: 'r1',
        week_start: '2026-02-23',
        week_end: '2026-03-01',
        summary: 'Semana de evolução significativa.',
        insight: 'Padrão de ansiedade em audiências.',
        challenge: 'Registrar todos os dias da próxima semana.',
      },
    ];
    mockFetchUserReports.mockResolvedValue(mockReports);

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockReports);
    expect(mockFetchUserReports).toHaveBeenCalledWith('u1');
  });

  it('returns empty array when user has no reports', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFetchUserReports.mockResolvedValue([]);

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual([]);
  });

  it('returns 500 when service throws', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFetchUserReports.mockRejectedValue(new Error('Connection lost'));

    const res = await GET();

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Connection lost');
  });
});
