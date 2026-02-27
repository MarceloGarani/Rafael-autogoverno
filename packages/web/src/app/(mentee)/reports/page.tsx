'use client';

export const dynamic = 'force-dynamic';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Heading, Text } from '@diario/ui';
import type { WeeklyReport } from '@/types/database';

export default function ReportsPage() {
  const { data: reports, isLoading } = useQuery<WeeklyReport[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await fetch('/api/reports');
      if (!res.ok) throw new Error('Failed to fetch reports');
      return res.json();
    },
  });

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Heading level={1} size="xl" className="mb-6">Relatórios Semanais</Heading>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-neutral-900 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && (!reports || reports.length === 0) && (
        <div className="text-center py-12">
          <Text color="secondary">Nenhum relatório disponível ainda.</Text>
          <Text color="muted" size="sm" className="mt-2">
            Relatórios são gerados automaticamente aos domingos.
          </Text>
        </div>
      )}

      <div className="space-y-3">
        {reports?.map((report) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="block p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <Text className="font-semibold">
                {new Date(report.week_start).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                {' — '}
                {new Date(report.week_end).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </Text>
              <Text size="xs" color="muted">
                {new Date(report.created_at).toLocaleDateString('pt-BR')}
              </Text>
            </div>
            <Text color="secondary" size="sm" className="line-clamp-2">
              {report.summary}
            </Text>
          </Link>
        ))}
      </div>
    </div>
  );
}
