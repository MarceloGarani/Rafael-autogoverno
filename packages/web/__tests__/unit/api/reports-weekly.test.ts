/**
 * Unit tests for POST /api/reports/weekly route handler.
 *
 * This route operates in two modes:
 * 1. Cron mode — x-cron-secret header matches CRON_SECRET; generates reports for all users.
 * 2. Manual mode — authenticated user triggers report generation for themselves.
 */

// --- Mocks (jest.mock is hoisted, so use inline factories) -----------

jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation(function (this: any, input: string | URL, init?: any) {
    const url = typeof input === 'string' ? new URL(input, 'http://localhost:3000') : input;
    this.url = url.toString();
    this.method = init?.method ?? 'GET';
    this.json = async () => JSON.parse(init?.body ?? '{}');
    const headerMap = new Map<string, string>();
    if (init?.headers) {
      for (const [k, v] of Object.entries(init.headers)) {
        headerMap.set(k.toLowerCase(), v as string);
      }
    }
    this.headers = { get: (key: string) => headerMap.get(key.toLowerCase()) || null };
  }),
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status ?? 200,
    })),
  },
}));

const mockGetUser = jest.fn();
const mockServiceIn = jest.fn();
const mockServiceSelect = jest.fn(() => ({ in: mockServiceIn }));
const mockServiceFrom = jest.fn(() => ({ select: mockServiceSelect }));

jest.mock('@/lib/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
  createServiceRoleClient: jest.fn(() => ({
    from: mockServiceFrom,
  })),
}));

const mockGenerateReport = jest.fn();

jest.mock('@/lib/services/report-service', () => ({
  generateAndSaveWeeklyReport: (...args: unknown[]) => mockGenerateReport(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/reports/weekly/route';

// --- Helpers ---------------------------------------------------------

function buildCronRequest() {
  return new NextRequest('http://localhost:3000/api/reports/weekly', {
    method: 'POST',
    headers: { 'x-cron-secret': 'test-cron-secret' },
  });
}

function buildManualRequest() {
  return new NextRequest('http://localhost:3000/api/reports/weekly', {
    method: 'POST',
  });
}

// --- Tests -----------------------------------------------------------

describe('POST /api/reports/weekly', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CRON_SECRET = 'test-cron-secret';
  });

  // -- Cron mode ------------------------------------------------------

  describe('Cron mode (valid x-cron-secret)', () => {
    it('returns 200 with results when valid cron secret is provided', async () => {
      const users = [{ id: 'u1' }, { id: 'u2' }];
      mockServiceIn.mockResolvedValue({ data: users });
      mockGenerateReport
        .mockResolvedValueOnce({ id: 'r1' })
        .mockResolvedValueOnce({ id: 'r2' });

      const res = await POST(buildCronRequest());

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.results).toEqual([
        { user_id: 'u1', status: 'ok', report_id: 'r1' },
        { user_id: 'u2', status: 'ok', report_id: 'r2' },
      ]);
      expect(mockGenerateReport).toHaveBeenCalledTimes(2);
      expect(mockGenerateReport).toHaveBeenCalledWith('u1');
      expect(mockGenerateReport).toHaveBeenCalledWith('u2');
    });

    it('handles per-user errors gracefully', async () => {
      const users = [{ id: 'u1' }, { id: 'u2' }, { id: 'u3' }];
      mockServiceIn.mockResolvedValue({ data: users });
      mockGenerateReport
        .mockResolvedValueOnce({ id: 'r1' })
        .mockRejectedValueOnce(new Error('AI service unavailable'))
        .mockResolvedValueOnce({ id: 'r3' });

      const res = await POST(buildCronRequest());

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.results).toEqual([
        { user_id: 'u1', status: 'ok', report_id: 'r1' },
        { user_id: 'u2', status: 'error', message: 'AI service unavailable' },
        { user_id: 'u3', status: 'ok', report_id: 'r3' },
      ]);
    });

    it('returns empty results when no users found', async () => {
      mockServiceIn.mockResolvedValue({ data: [] });

      const res = await POST(buildCronRequest());

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.results).toEqual([]);
      expect(mockGenerateReport).not.toHaveBeenCalled();
    });
  });

  // -- Manual mode ----------------------------------------------------

  describe('Manual mode (no cron secret)', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const res = await POST(buildManualRequest());

      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe('Unauthorized');
    });

    it('returns report when user is authenticated', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
      const mockReport = {
        id: 'r1',
        user_id: 'u1',
        week_start: '2026-02-23',
        week_end: '2026-03-01',
        summary: 'Semana produtiva.',
      };
      mockGenerateReport.mockResolvedValue(mockReport);

      const res = await POST(buildManualRequest());

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json).toEqual(mockReport);
      expect(mockGenerateReport).toHaveBeenCalledWith('u1');
    });
  });

  // -- Error handling -------------------------------------------------

  it('returns 500 on unexpected error', async () => {
    mockGetUser.mockRejectedValue(new Error('Database connection lost'));

    const res = await POST(buildManualRequest());

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Database connection lost');
  });
});
