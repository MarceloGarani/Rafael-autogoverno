'use client';

export const dynamic = 'force-dynamic';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useStreak } from '@/hooks/use-streak';
import { useQuery } from '@tanstack/react-query';
import { MenteeHome } from '@diario/ui';
import type { WeeklyDay } from '@diario/ui';
import { Text, Heading, Button } from '@diario/ui';
import Link from 'next/link';

export default function HomePage() {
  const { profile, loading: authLoading } = useAuth();
  const { data: streak } = useStreak();
  const router = useRouter();

  const { data: weeklyData } = useQuery({
    queryKey: ['weekly-intensity'],
    queryFn: async () => {
      const res = await fetch('/api/entries?period=week&limit=7');
      if (!res.ok) return [];
      const data = await res.json();
      return data.entries ?? [];
    },
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500" />
      </div>
    );
  }

  if (!profile) return null;

  // Build weekly data for the component
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const today = new Date();
  const weekDays: WeeklyDay[] = days.map((day, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = weeklyData?.find((e: any) => e.date === dateStr);
    return { day, intensity: entry?.intensity ?? null };
  });

  // Check if user has entries
  const hasEntries = weeklyData && weeklyData.length > 0;

  if (!hasEntries && !streak?.current_streak) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6">
        <Heading level={1} size="2xl">Bem-vindo ao Diário de Autogoverno!</Heading>
        <Text color="secondary">
          Comece registrando como foi o seu dia. Leva menos de 5 minutos.
        </Text>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => router.push('/entry/new')}
        >
          Fazer meu primeiro registro
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-6">
      <MenteeHome
        userName={profile.name.split(' ')[0]}
        streak={streak?.current_streak ?? 0}
        weeklyData={weekDays}
        onStartEntry={() => router.push('/entry/new')}
      />
      <div className="mt-6 space-y-3">
        <Link href="/history" className="block text-neutral-400 hover:text-white transition-colors text-sm">
          → Meu histórico
        </Link>
        <Link href="/reports" className="block text-neutral-400 hover:text-white transition-colors text-sm">
          → Último relatório
        </Link>
      </div>
    </div>
  );
}
