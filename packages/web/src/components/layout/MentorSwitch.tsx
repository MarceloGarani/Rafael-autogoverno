'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';

export function MentorBackButton() {
  const { profile } = useAuth();

  if (profile?.role !== 'mentor') return null;

  return (
    <Link
      href="/dashboard"
      className="fixed top-4 right-4 z-30 bg-neutral-900 hover:bg-neutral-800 text-white text-sm px-4 py-2 rounded-lg border border-neutral-800 transition-colors"
    >
      ← Voltar ao Dashboard
    </Link>
  );
}
