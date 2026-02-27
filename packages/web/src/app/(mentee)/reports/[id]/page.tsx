'use client';

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Heading, Text, Badge } from '@diario/ui';
import type { WeeklyReport } from '@/types/database';
import { CATEGORY_LABELS, EMOTION_LABELS } from '@/lib/utils/constants';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  const { data: report, isLoading } = useQuery<WeeklyReport>({
    queryKey: ['report', reportId],
    queryFn: async () => {
      const res = await fetch(`/api/reports/${reportId}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-neutral-900 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <Text color="secondary">Relatório não encontrado.</Text>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div>
        <Link href="/reports" className="text-sm text-neutral-500 hover:text-white mb-2 block">
          ← Voltar aos relatórios
        </Link>
        <Heading level={1} size="xl">
          Relatório Semanal
        </Heading>
        <Text color="muted" size="sm">
          {new Date(report.week_start).toLocaleDateString('pt-BR')} — {new Date(report.week_end).toLocaleDateString('pt-BR')}
        </Text>
      </div>

      <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={2} size="base" className="mb-3 text-red-500">Resumo</Heading>
        <Text color="secondary">{report.summary}</Text>
      </section>

      {report.patterns && report.patterns.length > 0 && (
        <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
          <Heading level={2} size="base" className="mb-3 text-red-500">Padrões Identificados</Heading>
          <ul className="space-y-2">
            {report.patterns.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <Text color="secondary" size="sm">{p.description}</Text>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
        <Heading level={2} size="base" className="mb-3 text-red-500">Evolução</Heading>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text size="sm" color="muted">Intensidade média</Text>
            <Text className="text-2xl font-bold">{report.evolution.avg_intensity_current.toFixed(1)}</Text>
            <Text size="xs" color="muted">
              Anterior: {report.evolution.avg_intensity_previous.toFixed(1)}
            </Text>
          </div>
          <div>
            <Text size="sm" color="muted">Estratégico</Text>
            <Text className="text-2xl font-bold text-green-500">{report.evolution.strategic_pct.toFixed(0)}%</Text>
            <Text size="xs" color="muted">
              Reativo: {report.evolution.reactive_pct.toFixed(0)}%
            </Text>
          </div>
        </div>
      </section>

      {report.insight && (
        <section className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
          <Heading level={2} size="base" className="mb-3 text-red-500">Insight da Semana</Heading>
          <Text color="secondary">{report.insight}</Text>
        </section>
      )}

      {report.challenge && (
        <section className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <Heading level={2} size="base" className="mb-3">Desafio para Próxima Semana</Heading>
          <Text>{report.challenge}</Text>
        </section>
      )}
    </div>
  );
}
