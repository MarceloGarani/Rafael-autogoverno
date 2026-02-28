/**
 * Unit tests for POST /api/reflections route handler.
 */

// --- Mocks (jest.mock is hoisted, so use inline factories) -----------

const mockSingle = jest.fn();
const mockEq2 = jest.fn(() => ({ single: mockSingle }));
const mockEq1 = jest.fn(() => ({ eq: mockEq2 }));
const mockSelect = jest.fn(() => ({ eq: mockEq1 }));
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

const mockGenerateAndSaveReflection = jest.fn();

jest.mock('@/lib/services/reflection-service', () => ({
  generateAndSaveReflection: (...args: unknown[]) => mockGenerateAndSaveReflection(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { POST } from '@/app/api/reflections/route';
import { NextRequest } from 'next/server';

// --- Helpers ---------------------------------------------------------

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

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

    const res = await POST(buildRequest({ entry_id: VALID_UUID }));

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 when entry_id is missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const res = await POST(buildRequest({}));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 400 when entry_id is not a valid UUID', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const res = await POST(buildRequest({ entry_id: 'not-a-uuid' }));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 403 when entry does not belong to user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSingle.mockResolvedValue({ data: null });

    const res = await POST(buildRequest({ entry_id: VALID_UUID }));

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns reflection id and questions on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSingle.mockResolvedValue({ data: { id: VALID_UUID } });
    mockGenerateAndSaveReflection.mockResolvedValue({
      id: 'ref-1',
      questions: [
        'O que você faria diferente?',
        'Essa reação reflete quem você quer ser?',
      ],
    });

    const res = await POST(buildRequest({ entry_id: VALID_UUID }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.id).toBe('ref-1');
    expect(json.questions).toHaveLength(2);
    expect(mockGenerateAndSaveReflection).toHaveBeenCalledWith(VALID_UUID);
  });

  it('returns 500 when service throws', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockSingle.mockResolvedValue({ data: { id: VALID_UUID } });
    mockGenerateAndSaveReflection.mockRejectedValue(new Error('Entry not found'));

    const res = await POST(buildRequest({ entry_id: VALID_UUID }));

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Entry not found');
  });
});
