/**
 * Unit tests for GET /api/reports/[id] route handler.
 */

// --- Mocks (jest.mock is hoisted, so use inline factories) -----------

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
  })),
}));

const mockFetchReportById = jest.fn();

jest.mock('@/lib/services/report-service', () => ({
  fetchReportById: (...args: unknown[]) => mockFetchReportById(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { GET } from '@/app/api/reports/[id]/route';
import { NextRequest } from 'next/server';

// --- Helpers ---------------------------------------------------------

function buildRequest() {
  return new NextRequest('http://localhost:3000/api/reports/r1', { method: 'GET' });
}

// --- Tests -----------------------------------------------------------

describe('GET /api/reports/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET(buildRequest(), { params: { id: 'r1' } });

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 404 when report not found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFetchReportById.mockResolvedValue(null);

    const res = await GET(buildRequest(), { params: { id: 'r1' } });

    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toBe('Not found');
    expect(mockFetchReportById).toHaveBeenCalledWith('r1');
  });

  it('returns 403 when report belongs to another user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFetchReportById.mockResolvedValue({
      id: 'r1',
      user_id: 'other-user',
      summary: 'Relatório de outra pessoa',
    });

    const res = await GET(buildRequest(), { params: { id: 'r1' } });

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns 200 with report on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    const mockReport = {
      id: 'r1',
      user_id: 'u1',
      week_start: '2026-02-23',
      week_end: '2026-03-01',
      summary: 'Semana produtiva com evolução.',
      insight: 'Padrão de frustração em cobranças.',
      challenge: 'Praticar pausa antes de reagir.',
    };
    mockFetchReportById.mockResolvedValue(mockReport);

    const res = await GET(buildRequest(), { params: { id: 'r1' } });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockReport);
    expect(mockFetchReportById).toHaveBeenCalledWith('r1');
  });

  it('returns 500 when service throws', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFetchReportById.mockRejectedValue(new Error('DB connection failed'));

    const res = await GET(buildRequest(), { params: { id: 'r1' } });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('DB connection failed');
  });
});
