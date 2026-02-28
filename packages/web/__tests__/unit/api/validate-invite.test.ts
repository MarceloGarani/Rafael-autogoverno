/**
 * Unit tests for POST /api/auth/validate-invite route handler.
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

// --- Import handler after all mocks ---------------------------------

import { POST } from '@/app/api/auth/validate-invite/route';

// --- Helpers ---------------------------------------------------------

function buildRequest(body?: Record<string, unknown>) {
  return {
    json: async () => body ?? {},
  } as unknown as Request;
}

// --- Tests -----------------------------------------------------------

describe('POST /api/auth/validate-invite', () => {
  const originalEnv = process.env.INVITE_CODES;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.INVITE_CODES = 'TEST-CODE-1,TEST-CODE-2';
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.INVITE_CODES = originalEnv;
    } else {
      delete process.env.INVITE_CODES;
    }
  });

  it('returns 400 when code field is missing', async () => {
    const res = await POST(buildRequest({}));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.valid).toBe(false);
    expect(json.error).toBeDefined();
  });

  it('returns 400 when code is invalid', async () => {
    const res = await POST(buildRequest({ code: 'WRONG-CODE' }));

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.valid).toBe(false);
    expect(json.error).toBe('Código de convite inválido');
  });

  it('returns 200 with valid: true when code is valid (case insensitive)', async () => {
    const res = await POST(buildRequest({ code: 'test-code-1' }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.valid).toBe(true);
  });

  it('returns 500 on unexpected error', async () => {
    const badRequest = {
      json: async () => { throw new Error('parse failure'); },
    } as unknown as Request;

    const res = await POST(badRequest);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});
