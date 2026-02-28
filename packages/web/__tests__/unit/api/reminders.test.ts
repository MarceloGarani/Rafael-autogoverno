/**
 * Unit tests for POST /api/reminders/daily route handler.
 *
 * This is a cron-only route. It checks the x-cron-secret header and
 * returns 401 if the secret is missing or incorrect.
 *
 * For each mentee with reminder_enabled=true, it checks whether a
 * daily_entry already exists for today. If not, it sends a reminder email.
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

const mockMenteesEq2 = jest.fn();
const mockMenteesEq1 = jest.fn(() => ({ eq: mockMenteesEq2 }));
const mockMenteesSelect = jest.fn(() => ({ eq: mockMenteesEq1 }));

const mockEntriesEq2 = jest.fn();
const mockEntriesEq1 = jest.fn(() => ({ eq: mockEntriesEq2 }));
const mockEntriesSelect = jest.fn(() => ({ eq: mockEntriesEq1 }));

const mockServiceFrom = jest.fn((table: string) => {
  if (table === 'users') return { select: mockMenteesSelect };
  return { select: mockEntriesSelect };
});

jest.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: jest.fn(() => ({
    from: mockServiceFrom,
  })),
}));

const mockSendReminderEmail = jest.fn();

jest.mock('@/lib/services/email-service', () => ({
  sendReminderEmail: (...args: unknown[]) => mockSendReminderEmail(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/reminders/daily/route';

// --- Helpers ---------------------------------------------------------

function buildCronRequest() {
  return new NextRequest('http://localhost:3000/api/reminders/daily', {
    method: 'POST',
    headers: { 'x-cron-secret': 'test-cron-secret' },
  });
}

function buildRequestWithoutSecret() {
  return new NextRequest('http://localhost:3000/api/reminders/daily', {
    method: 'POST',
  });
}

function buildRequestWithWrongSecret() {
  return new NextRequest('http://localhost:3000/api/reminders/daily', {
    method: 'POST',
    headers: { 'x-cron-secret': 'wrong-secret' },
  });
}

// --- Tests -----------------------------------------------------------

describe('POST /api/reminders/daily', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CRON_SECRET = 'test-cron-secret';
  });

  // -- Authorization --------------------------------------------------

  it('returns 401 when cron secret is missing', async () => {
    const res = await POST(buildRequestWithoutSecret());

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 401 when cron secret is wrong', async () => {
    const res = await POST(buildRequestWithWrongSecret());

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  // -- Reminder sending -----------------------------------------------

  it('sends reminders to mentees who have not registered today', async () => {
    const mentees = [
      { id: 'm1', name: 'Alice', email: 'alice@test.com', reminder_enabled: true },
      { id: 'm2', name: 'Bob', email: 'bob@test.com', reminder_enabled: true },
    ];
    mockMenteesEq2.mockResolvedValue({ data: mentees });

    // Both mentees have no entries today (count = 0)
    mockEntriesEq2.mockResolvedValue({ count: 0 });
    mockSendReminderEmail.mockResolvedValue(undefined);

    const res = await POST(buildCronRequest());

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results).toEqual([
      { user_id: 'm1', status: 'sent' },
      { user_id: 'm2', status: 'sent' },
    ]);
    expect(mockSendReminderEmail).toHaveBeenCalledTimes(2);
    expect(mockSendReminderEmail).toHaveBeenCalledWith('alice@test.com', 'Alice');
    expect(mockSendReminderEmail).toHaveBeenCalledWith('bob@test.com', 'Bob');
  });

  it('skips mentees who already registered today', async () => {
    const mentees = [
      { id: 'm1', name: 'Alice', email: 'alice@test.com', reminder_enabled: true },
    ];
    mockMenteesEq2.mockResolvedValue({ data: mentees });

    // Mentee already has an entry today (count = 1)
    mockEntriesEq2.mockResolvedValue({ count: 1 });

    const res = await POST(buildCronRequest());

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results).toEqual([
      { user_id: 'm1', status: 'skipped' },
    ]);
    expect(mockSendReminderEmail).not.toHaveBeenCalled();
  });

  it('handles email send errors gracefully', async () => {
    const mentees = [
      { id: 'm1', name: 'Alice', email: 'alice@test.com', reminder_enabled: true },
      { id: 'm2', name: 'Bob', email: 'bob@test.com', reminder_enabled: true },
    ];
    mockMenteesEq2.mockResolvedValue({ data: mentees });

    // Both have no entries today
    mockEntriesEq2.mockResolvedValue({ count: 0 });

    // First email succeeds, second fails
    mockSendReminderEmail
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('SMTP connection failed'));

    const res = await POST(buildCronRequest());

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results).toEqual([
      { user_id: 'm1', status: 'sent' },
      { user_id: 'm2', status: 'error', message: 'SMTP connection failed' },
    ]);
  });

  it('returns empty results when no mentees found', async () => {
    mockMenteesEq2.mockResolvedValue({ data: [] });

    const res = await POST(buildCronRequest());

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results).toEqual([]);
    expect(mockSendReminderEmail).not.toHaveBeenCalled();
  });
});
