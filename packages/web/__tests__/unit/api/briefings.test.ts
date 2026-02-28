/**
 * Unit tests for POST /api/briefings and GET /api/briefings/[menteeId] route handlers.
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

const mockGenerateAndSaveBriefing = jest.fn();
const mockGetBriefingHistory = jest.fn();

jest.mock('@/lib/services/briefing-service', () => ({
  generateAndSaveBriefing: (...args: unknown[]) => mockGenerateAndSaveBriefing(...args),
  getBriefingHistory: (...args: unknown[]) => mockGetBriefingHistory(...args),
}));

// --- Import handlers after all mocks ---------------------------------

import { POST } from '@/app/api/briefings/route';
import { GET } from '@/app/api/briefings/[menteeId]/route';
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

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const MENTEE_ID = 'mentee-abc';

// --- Tests: POST /api/briefings --------------------------------------

describe('POST /api/briefings', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/briefings', { mentee_id: VALID_UUID })
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 403 when not mentor', async () => {
    mockMenteeAuth();

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/briefings', { mentee_id: VALID_UUID })
    );

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns 400 when mentee_id is missing', async () => {
    mockMentorAuth();

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/briefings', {})
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 400 when mentee_id is not a valid UUID', async () => {
    mockMentorAuth();

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/briefings', { mentee_id: 'not-a-uuid' })
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 200 with briefing on success', async () => {
    mockMentorAuth();
    const mockBriefing = {
      id: 'brief-1',
      mentor_id: 'mentor-1',
      mentee_id: VALID_UUID,
      summary: 'Mentorado demonstrou progresso na gestão de ansiedade.',
      patterns: ['Ansiedade recorrente em audiências'],
      suggested_topics: ['Técnicas de respiração', 'Preparação pré-audiência'],
    };
    mockGenerateAndSaveBriefing.mockResolvedValue(mockBriefing);

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/briefings', { mentee_id: VALID_UUID })
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockBriefing);
    expect(mockGenerateAndSaveBriefing).toHaveBeenCalledWith('mentor-1', VALID_UUID);
  });

  it('returns 500 on error', async () => {
    mockMentorAuth();
    mockGenerateAndSaveBriefing.mockRejectedValue(new Error('AI service unavailable'));

    const res = await POST(
      buildRequest('POST', 'http://localhost:3000/api/briefings', { mentee_id: VALID_UUID })
    );

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('AI service unavailable');
  });
});

// --- Tests: GET /api/briefings/[menteeId] ----------------------------

describe('GET /api/briefings/[menteeId]', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    mockNoAuth();

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/briefings/' + MENTEE_ID),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 403 when not mentor', async () => {
    mockMenteeAuth();

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/briefings/' + MENTEE_ID),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns briefing history on success', async () => {
    mockMentorAuth();
    const mockHistory = [
      {
        id: 'brief-1',
        generated_at: '2026-02-20T10:00:00Z',
        summary: 'Semana de alta intensidade emocional.',
      },
      {
        id: 'brief-2',
        generated_at: '2026-02-27T10:00:00Z',
        summary: 'Evolução notável na autoavaliação.',
      },
    ];
    mockGetBriefingHistory.mockResolvedValue(mockHistory);

    const res = await GET(
      buildRequest('GET', 'http://localhost:3000/api/briefings/' + MENTEE_ID),
      { params: { menteeId: MENTEE_ID } }
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockHistory);
    expect(mockGetBriefingHistory).toHaveBeenCalledWith('mentor-1', MENTEE_ID);
  });
});
