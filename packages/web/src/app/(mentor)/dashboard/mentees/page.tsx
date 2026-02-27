'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useMenteesList } from '@/hooks/use-dashboard';
import { Heading, Text, Input, Chip, Badge } from '@diario/ui';

type StatusFilter = 'all' | 'active' | 'absent' | 'inactive';

export default function MenteesListPage() {
  const { data: mentees, isLoading } = useMenteesList();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = (mentees ?? []).filter((m: any) => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  });

  const statusConfig = {
    active: { label: '🟢', badge: 'success' as const },
    absent: { label: '🟡', badge: 'warning' as const },
    inactive: { label: '🔴', badge: 'danger' as const },
  };

  return (
    <div>
      <Heading level={1} size="xl" className="mb-6">Mentorados</Heading>

      <div className="space-y-3 mb-6">
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <Chip selected={statusFilter === 'all'} onSelect={() => setStatusFilter('all')}>Todos</Chip>
          <Chip selected={statusFilter === 'active'} onSelect={() => setStatusFilter('active')}>Ativos</Chip>
          <Chip selected={statusFilter === 'absent'} onSelect={() => setStatusFilter('absent')}>Ausentes</Chip>
          <Chip selected={statusFilter === 'inactive'} onSelect={() => setStatusFilter('inactive')}>Inativos</Chip>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-neutral-900 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((mentee: any) => (
          <Link
            key={mentee.id}
            href={`/dashboard/mentees/${mentee.id}`}
            className="block p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg">{statusConfig[mentee.status as keyof typeof statusConfig]?.label}</span>
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold">
                  {mentee.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <Text className="font-semibold">{mentee.name}</Text>
                  <Text size="sm" color="muted">
                    Último: {mentee.last_entry_date
                      ? new Date(mentee.last_entry_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                      : 'Nunca'}
                    {' · '}🔥 {mentee.streak} dias
                  </Text>
                </div>
              </div>
              <div className="text-right">
                <Text size="sm" color="muted">Intensidade média</Text>
                <Text className="font-bold">{mentee.avg_intensity_week.toFixed(1)}</Text>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12">
          <Text color="secondary">Nenhum mentorado encontrado.</Text>
        </div>
      )}
    </div>
  );
}
