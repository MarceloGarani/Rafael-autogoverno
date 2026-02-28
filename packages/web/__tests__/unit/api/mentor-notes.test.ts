/**
 * Unit tests for GET and PUT /api/mentor-notes/[menteeId] route handlers.
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

const mockGetMentorNote = jest.fn();
const mockUpsertMentorNote = jest.fn();

jest.mock('@/lib/db/mentor-notes', () => ({
  getMentorNote: (...args: unknown[]) => mockGetMentorNote(...args),
  upsertMentorNote: (...args: unknown[]) => mockUpsertMentorNote(...args),
}));

// --- Import handlers after all mocks ---------------------------------

import { GET, PUT } from '@/app/api/mentor-notes/[menteeId]/route';
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

// --- Tests -----------------------------------------------------------

describe('GET /api/mentor-notes/[menteeId]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 403 when user is not a mentor', async () => {
    mockMenteeAuth();

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns note content on success', async () => {
    mockMentorAuth();
    const mockNote = { id: 'note-1', content: 'Mentorado mostra evolução consistente.' };
    mockGetMentorNote.mockResolvedValue(mockNote);

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockNote);
    expect(mockGetMentorNote).toHaveBeenCalledWith('mentor-1', MENTEE_ID);
  });

  it('returns { content: "" } when no note exists', async () => {
    mockMentorAuth();
    mockGetMentorNote.mockResolvedValue(null);

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ content: '' });
  });
});

describe('PUT /api/mentor-notes/[menteeId]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await PUT(
      buildRequest('PUT', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID, { content: 'Nova nota' }),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 403 when user is not a mentor', async () => {
    mockMenteeAuth();

    const res = await PUT(
      buildRequest('PUT', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID, { content: 'Nova nota' }),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns updated note on success', async () => {
    mockMentorAuth();
    const updatedNote = { id: 'note-1', content: 'Nota atualizada com observações da sessão.' };
    mockUpsertMentorNote.mockResolvedValue(updatedNote);

    const res = await PUT(
      buildRequest('PUT', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID, {
        content: 'Nota atualizada com observações da sessão.',
      }),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(updatedNote);
    expect(mockUpsertMentorNote).toHaveBeenCalledWith(
      'mentor-1',
      MENTEE_ID,
      'Nota atualizada com observações da sessão.'
    );
  });

  it('returns 500 on error', async () => {
    mockMentorAuth();
    mockUpsertMentorNote.mockRejectedValue(new Error('DB write failed'));

    const res = await PUT(
      buildRequest('PUT', 'http://localhost:3000/api/mentor-notes/' + MENTEE_ID, { content: 'Nota' }),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('DB write failed');
  });
});
