/**
 * Unit tests for POST and GET /api/entries route handlers.
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

const mockSubmitEntry = jest.fn();
const mockFetchEntries = jest.fn();

jest.mock('@/lib/services/entry-service', () => ({
  submitEntry: (...args: unknown[]) => mockSubmitEntry(...args),
  fetchEntries: (...args: unknown[]) => mockFetchEntries(...args),
}));

// --- Import handlers after all mocks ---------------------------------

import { POST, GET } from '@/app/api/entries/route';
import { NextRequest } from 'next/server';

// --- Helpers ---------------------------------------------------------

function buildRequest(method: string, url: string, body?: Record<string, unknown>) {
  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
}

const validEntryBody = {
  situation: 'Audiência complicada com juiz hostil e pressão extrema',
  category: 'audiencia',
  emotion: 'ansiedade',
  intensity: 7,
  reaction: 'Respirei fundo e mantive a calma durante toda a sessão',
  self_perception: 'strategic',
};

// --- Tests -----------------------------------------------------------

describe('POST /api/entries', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(buildRequest('POST', 'http://localhost:3000/api/entries', validEntryBody));

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 when situation is too short', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/entries', { ...validEntryBody, situation: 'curta' }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('10 caracteres');
  });

  it('returns 400 when required fields are missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/entries', {
        situation: 'Uma situação longa o suficiente para validação aqui',
      }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Todos os campos são obrigatórios');
  });

  it('returns 400 when intensity is out of range', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/entries', { ...validEntryBody, intensity: 15 }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Intensidade');
  });

  it('returns 200 with entry id and badges on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSubmitEntry.mockResolvedValue({
      entry: { id: 'entry-1' },
      newBadges: ['7_days'],
    });

    const res = await POST(buildRequest('POST', 'http://localhost:3000/api/entries', validEntryBody));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ id: 'entry-1', status: 'created', newBadges: ['7_days'] });
    expect(mockSubmitEntry).toHaveBeenCalledWith('u1', expect.objectContaining({ category: 'audiencia' }));
  });
});

describe('GET /api/entries', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await GET(buildRequest('GET', 'http://localhost:3000/api/entries'));

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns paginated entries on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    const mockResult = { entries: [{ id: 'e1' }, { id: 'e2' }], total: 2 };
    mockFetchEntries.mockResolvedValue(mockResult);

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/entries?page=1&limit=10&period=week'),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockResult);
    expect(mockFetchEntries).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ period: 'week', page: 1, limit: 10 }),
    );
  });

  it('returns 500 when service throws', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockFetchEntries.mockRejectedValue(new Error('DB failure'));

    const res = await GET(buildRequest('GET', 'http://localhost:3000/api/entries'));

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('DB failure');
  });
});
