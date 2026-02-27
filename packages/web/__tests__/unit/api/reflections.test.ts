/**
 * Unit tests for POST /api/reflections route handler.
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

const mockGenerateAndSaveReflection = jest.fn();

jest.mock('@/lib/services/reflection-service', () => ({
  generateAndSaveReflection: (...args: unknown[]) => mockGenerateAndSaveReflection(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { POST } from '@/app/api/reflections/route';
import { NextRequest } from 'next/server';

// --- Helpers ---------------------------------------------------------

function buildRequest(body?: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/reflections', {
    method: 'POST',
    body: body ? JSON.stringify(body) : '{}',
  });
}

// --- Tests -----------------------------------------------------------

describe('POST /api/reflections', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await POST(buildRequest({ entry_id: 'e1' }));

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 when entry_id is missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const res = await POST(buildRequest({}));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('entry_id is required');
  });

  it('returns reflection id and questions on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockGenerateAndSaveReflection.mockResolvedValue({
      id: 'ref-1',
      questions: [
        'O que você faria diferente?',
        'Essa reação reflete quem você quer ser?',
      ],
    });

    const res = await POST(buildRequest({ entry_id: 'entry-42' }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe('ref-1');
    expect(json.questions).toHaveLength(2);
    expect(mockGenerateAndSaveReflection).toHaveBeenCalledWith('entry-42');
  });

  it('returns 500 when service throws', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockGenerateAndSaveReflection.mockRejectedValue(new Error('Entry not found'));

    const res = await POST(buildRequest({ entry_id: 'bad-id' }));

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Entry not found');
  });
});
