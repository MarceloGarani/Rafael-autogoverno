import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { validateInviteCodeSchema } from '@/lib/api/schemas';
import { sanitizedError } from '@/lib/api/helpers';

const DEFAULT_CODES = ['AUTOGOVERNO2026', 'RAFAEL-MENTOR'];

function getValidCodes(): string[] {
  const envCodes = process.env.INVITE_CODES;
  if (envCodes) {
    return envCodes.split(',').map((c) => c.trim()).filter(Boolean);
  }
  return DEFAULT_CODES;
}

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Compare against itself to maintain constant time, then return false
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateInviteCodeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { valid: false, error: parsed.error.issues[0]?.message || 'Dados inválidos' },
        { status: 400 }
      );
    }

    const { code } = parsed.data;
    const upperCode = code.toUpperCase();
    const validCodes = getValidCodes();

    const isValid = validCodes.some((validCode) =>
      timingSafeCompare(upperCode, validCode.toUpperCase())
    );

    if (!isValid) {
      return NextResponse.json(
        { valid: false, error: 'Código de convite inválido' },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    return sanitizedError(error);
  }
}
