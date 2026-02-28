/**
 * Unit tests for PUT /api/reflections/[id] route handler.
 */

// --- Mocks (jest.mock is hoisted, so use inline factories) -----------

const mockOwnershipSingle = jest.fn();
const mockOwnershipEq2 = jest.fn(() => ({ single: mockOwnershipSingle }));
const mockOwnershipEq1 = jest.fn(() => ({ eq: mockOwnershipEq2 }));
const mockOwnershipSelect = jest.fn(() => ({ eq: mockOwnershipEq1 }));
const mockFrom = jest.fn(() => ({ select: mockOwnershipSelect }));

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

const mockSaveReflectionAnswers = jest.fn();

jest.mock('@/lib/services/reflection-service', () => ({
  saveReflectionAnswers: (...args: unknown[]) => mockSaveReflectionAnswers(...args),
}));

// --- Import handler after all mocks ---------------------------------

import { PUT } from '@/app/api/reflections/[id]/route';
import { NextRequest } from 'next/server';

// --- Helpers ---------------------------------------------------------

function buildRequest(body?: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/reflections/ref-1', {
    method: 'PUT',
    body: body ? JSON.stringify(body) : '{}',
  });
}

// --- Tests -----------------------------------------------------------

describe('PUT /api/reflections/[id]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const res = await PUT(
      buildRequest({ answers: ['resposta'] }),
      { params: { id: 'ref-1' } },
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 when answers is not an array', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });

    const res = await PUT(
      buildRequest({ answers: 'not-an-array' }),
      { params: { id: 'ref-1' } },
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 403 when reflection does not belong to user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockOwnershipSingle.mockResolvedValue({ data: null });

    const res = await PUT(
      buildRequest({ answers: ['resposta 1', 'resposta 2'] }),
      { params: { id: 'ref-1' } },
    );

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns 200 with updated reflection on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockOwnershipSingle.mockResolvedValue({
      data: { id: 'ref-1', daily_entries: { user_id: 'u1' } },
    });
    const updatedReflection = {
      id: 'ref-1',
      questions: ['Pergunta 1?', 'Pergunta 2?'],
      answers: ['resposta 1', 'resposta 2'],
    };
    mockSaveReflectionAnswers.mockResolvedValue(updatedReflection);

    const res = await PUT(
      buildRequest({ answers: ['resposta 1', 'resposta 2'] }),
      { params: { id: 'ref-1' } },
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(updatedReflection);
    expect(mockSaveReflectionAnswers).toHaveBeenCalledWith('ref-1', ['resposta 1', 'resposta 2']);
  });

  it('returns 500 when service throws', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
    mockOwnershipSingle.mockResolvedValue({
      data: { id: 'ref-1', daily_entries: { user_id: 'u1' } },
    });
    mockSaveReflectionAnswers.mockRejectedValue(new Error('DB write failed'));

    const res = await PUT(
      buildRequest({ answers: ['resposta'] }),
      { params: { id: 'ref-1' } },
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('DB write failed');
  });
});
